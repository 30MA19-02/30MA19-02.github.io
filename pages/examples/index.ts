interface Contents {
  [name: string]: string;
}
export const example_list: string[] = [
  "basic",
]
const examples: Contents = Object.fromEntries(example_list.map(
  name => [name, `./${name}/index.mdx`]
));
export default examples;