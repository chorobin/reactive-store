import { Action } from "./action";
import { Subject, Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";
import { Reducers, PayloadOfReducer } from "./reducer";

export type Dispatch<TState, TReducers extends Reducers<TState>> = <TActionType extends keyof TReducers & string>(
  action: Action<TActionType, PayloadOfReducer<TReducers[TActionType]>>,
) => void;

export type Store<TState, TReducers extends Reducers<TState>> = {
  action$: Observable<Action<string, PayloadOfReducer<TReducers[keyof TReducers]>>>;
  state$: Observable<TState>;
  dispatch: Dispatch<TState, TReducers>;
};

export const createStore: <TState, TReducers extends Reducers<TState>>(initialState: TState, reducers: TReducers) => Store<TState, TReducers> = <
  TState,
  TReducers extends Reducers<TState>
>(
  initialState: TState,
  reducers: TReducers,
) => {
  const action$ = new Subject<Action<string, PayloadOfReducer<TReducers[keyof TReducers]>>>();
  const state$ = action$.pipe(
    scan((state: TState, action: Action<string, PayloadOfReducer<TReducers[keyof TReducers]>>) => reducers[action.type](state, action.payload), initialState),
    startWith(initialState),
  );
  return {
    action$: action$.asObservable(),
    state$: state$,
    dispatch: <TActionType extends keyof TReducers & string>(action: Action<TActionType, PayloadOfReducer<TReducers[TActionType]>>) => action$.next(action),
  };
};
