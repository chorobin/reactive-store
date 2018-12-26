import { Dispatch } from "../../lib/store";
import { sayHello } from "../../store/hello-world/action";
import { helloWorldConnect } from "../../store/hello-world/connect";
import { HelloWorldComponent } from "../../components/hello-world/hello-world-component";

export const helloWorldComponentConnector = helloWorldConnect((state) => ({ sayHello: state.sayHello, anotherProp: "hi" }), {
  onSayHello: () => sayHello("hi"),
});

export const HelloWorldContainer = helloWorldComponentConnector(HelloWorldComponent);
