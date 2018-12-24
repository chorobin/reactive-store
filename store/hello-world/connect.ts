import { connect } from "../../lib/connect";
import { helloWorldStore } from "./index";

export const helloWorldConnect = connect(helloWorldStore);
