import { Reducer } from "../../lib/reducer";
import { HelloWorldActionType } from "./action";

export const sayHello: Reducer<HelloWorldState, string> = (state, payload) => ({ sayHello: !state.sayHello });

export const helloWorldReducers = {
  [HelloWorldActionType.SayHello]: sayHello,
};
