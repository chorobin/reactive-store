import merge from "webpack-merge";
import common from "./webpack.common";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default merge(common, {
  mode: "production",
  plugins: [new BundleAnalyzerPlugin()],
});
