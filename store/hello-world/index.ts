import { createStore } from "../../lib/store";
import { helloWorldReducers } from "./reducer";

const initialState: HelloWorldState = {
  sayHello: false,
};

export const helloWorldStore = createStore(initialState, helloWorldReducers);
