import { ActionCreator } from "../../lib/action";

export enum HelloWorldActionType {
  SayHello = "SAY_HELLO",
}

export const sayHello: ActionCreator<HelloWorldActionType.SayHello, string> = (payload: string) => ({
  type: HelloWorldActionType.SayHello,
  payload,
});
