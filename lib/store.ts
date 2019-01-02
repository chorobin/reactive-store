import { Action } from "./action";
import { Subject, Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";
import { PayloadOfReducer, Reducers } from "./reducer";

export type Dispatch<TReducers> = <TActionType extends keyof TReducers & string>(action: Action<TActionType, PayloadOfReducer<TReducers[TActionType]>>) => void;

export type Store<TState, TReducers, TAction> = {
  action$: Observable<TAction>;
  state$: Observable<TState>;
  dispatch: Dispatch<TReducers>;
  reducers: TReducers;
  initialState: TState;
};

export const createStore: <TState, TReducers extends Reducers<TState, unknown>>(
  initialState: TState,
  reducers: TReducers,
) => Store<TState, TReducers, Action<keyof TReducers & string, unknown>> = <
  TState,
  TReducers extends Reducers<TState, unknown>,
  TActionTypes extends keyof TReducers & string
>(
  initialState: TState,
  reducers: TReducers,
) => {
  const action$ = new Subject<Action<TActionTypes, unknown>>();
  const state$ = action$.pipe(
    scan((state: TState, action: Action<TActionTypes, unknown>) => reducers[action.type](state, action.payload), initialState),
    startWith(initialState),
  );
  return {
    initialState,
    action$: action$.asObservable(),
    state$: state$,
    dispatch: <TActionType extends TActionTypes & string>(action: Action<TActionType, PayloadOfReducer<TReducers[TActionType]>>) => action$.next(action),
    reducers,
  };
};
