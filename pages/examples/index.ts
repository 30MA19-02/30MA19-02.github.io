interface Paths {
  [name: string]: string;
}
export const example_list: string[] = [
  "basic",
];
export const example_path: Paths = Object.fromEntries(example_list.map(
  name => [name, `./${name}/index.mdx`]
));