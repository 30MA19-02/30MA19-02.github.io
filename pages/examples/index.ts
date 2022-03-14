import { MDXProps } from "mdx/types";
import basic from "./basic/index.mdx";
type Content = (props: MDXProps) => JSX.Element;
const examples: { [name: string] : Content; } = {
  "basic": basic,
};
export default examples;