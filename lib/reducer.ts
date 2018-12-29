export type Reducer<TState, TPayload = null> = TPayload extends null ? (state: TState) => TState : (state: TState, payload: TPayload) => TState;

export type Reducers<TState, TPayload = null> = {
  [type: string]: Reducer<TState, TPayload>;
};

export type PayloadOfReducer<TReducer> = TReducer extends Reducer<infer TActionType, infer TPayload> ? (TPayload extends {} ? null : TPayload) : never;
