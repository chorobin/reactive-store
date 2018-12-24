import { Dispatch } from "../../lib/store";
import { sayHello } from "../../store/hello-world/action";
import { helloWorldConnect } from "../../store/hello-world/connect";
import { HelloWorldComponent } from "../../components/hello-world/hello-world-component";

const mapStateToProps = (state: HelloWorldState) => ({ sayHello: state.sayHello, anotherProp: "hi" });
const mapDispatchToProps = (dispatch: Dispatch<HelloWorldState>) => ({ onSayHello: () => dispatch(sayHello) });

export const helloWorldComponentConnector = helloWorldConnect(mapStateToProps, mapDispatchToProps);

export const HelloWorldContainer = helloWorldComponentConnector(HelloWorldComponent);
