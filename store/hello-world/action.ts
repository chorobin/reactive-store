import { Action } from "../../lib/action";

export enum HelloWorldActionType {
  SayHello = "SAY_HELLO",
}

export const sayHello: Action<HelloWorldState> = (state) => ({ sayHello: !state.sayHello });

