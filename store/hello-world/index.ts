import { createStore } from "../../lib/store";

const initialState: HelloWorldState = {
  sayHello: false,
};

export const helloWorldStore = createStore(initialState);
