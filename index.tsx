import * as React from "react";
import * as ReactDOM from "react-dom";
import { HelloWorldContainer } from "./containers/hello-world/hello-world-container";

ReactDOM.render(<HelloWorldContainer anotherProp={"hi"} />, document.getElementById("app"));
