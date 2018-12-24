import { Action } from "./action";
import { Subject, Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";

export type Dispatch<TState> = (action: Action<TState>) => void;
export type Store<TState> = { action$: Observable<Action<TState>>; state$: Observable<TState>; dispatch: Dispatch<TState> };

export const createStore = <TState>(initialState: TState) => {
  const action$ = new Subject<Action<TState>>();
  const state$ = action$.pipe(
    scan((state: TState, action: Action<TState>) => action(state), initialState),
    startWith(initialState),
  );
  return {
    action$: action$.asObservable(),
    state$: state$,
    dispatch: (action: Action<TState>) => action$.next(action),
  };
};
