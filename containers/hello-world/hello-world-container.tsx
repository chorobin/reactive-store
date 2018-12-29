import { sayHelloAction } from "../../store/hello-world/action";
import { helloWorldConnect } from "../../store/hello-world/connect";
import { HelloWorldComponent } from "../../components/hello-world/hello-world-component";
import { sayHelloSelector } from "../../store/hello-world/selector";

const selectors = {
  sayHello: sayHelloSelector,
  anotherProp: (state: HelloWorldState) => "hi",
};

const actions = {
  onSayHello: sayHelloAction,
};

export const helloWorldComponentConnector = helloWorldConnect(selectors, actions);
export const HelloWorldContainer = helloWorldComponentConnector(HelloWorldComponent);
