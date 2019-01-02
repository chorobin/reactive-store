import { Observable, merge } from "rxjs";
import { Store } from "./store";
import { scan, startWith, filter } from "rxjs/operators";
import { Action } from "./action";
import { Reducers } from "./reducer";

export type Effect<TInputAction, TOutputAction, TState> = (action$: Observable<TInputAction>, state$: Observable<TState>) => Observable<TOutputAction>;

export const useEffect = <TInputAction extends Action<string, unknown>, TOutputAction extends TInputAction, TState>(
  effect: Effect<TInputAction, TOutputAction, TState>,
) => <TReducers extends Reducers<TState, unknown>>(store: Store<TState, TReducers, TInputAction>) => {
  const action$ = merge(store.action$, effect(store.action$, store.state$));
  const state$ = action$.pipe(
    scan((state: TState, action: TInputAction) => store.reducers[action.type](state, action.payload), store.initialState),
    startWith(store.initialState),
  );
  const newStore: Store<TState, TReducers, TInputAction> = {
    action$,
    state$,
    dispatch: store.dispatch,
    initialState: store.initialState,
    reducers: store.reducers,
  };
  return newStore;
};

export const ofType = <TActionType extends string>(actionType: TActionType) => filter((action: Action<string, unknown>) => action.type === actionType);
