import { ActionCreator } from "../../lib/action";

export enum HelloWorldActionType {
  SayHello = "SAY_HELLO",
}

export const sayHelloAction: ActionCreator<HelloWorldActionType.SayHello> = () => ({
  type: HelloWorldActionType.SayHello,
});
