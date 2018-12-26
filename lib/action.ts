export type Action<TActionType extends string = string, TPayload = null> = TPayload extends null
  ? { type: TActionType }
  : { type: TActionType; payload: TPayload };

export type ActionCreator<TActionType extends string = string, TPayload = null> = TPayload extends null
  ? (() => Action<TActionType>)
  : ((payload: TPayload) => Action<TActionType, TPayload>);

export type PayloadOfActionCreator<TActionCreator> = TActionCreator extends ActionCreator<infer TActionType, infer TPayload> ? TPayload : never;
