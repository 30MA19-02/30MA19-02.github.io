import type { MDXProps } from "mdx/types";
import type { ComponentType } from "react";

const contents_: {[name: string]: (Promise<typeof import("*.mdx")>)} = {
  "basic": import("./basic/index.mdx")
}
export async function loader(name: string): Promise<ComponentType<MDXProps>>{
  return (await contents_[name]).default;
}