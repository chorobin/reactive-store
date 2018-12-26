export type Reducer<TState, TPayload = null> = TPayload extends null ? (state: TState) => TState : (state: TState, payload: TPayload) => TState;

export type Reducers<TState> = {
  [type: string]: Reducer<TState, unknown>;
};

export type PayloadOfReducer<TReducer> = TReducer extends Reducer<infer TActionType, infer TPayload> ? TPayload : never;
