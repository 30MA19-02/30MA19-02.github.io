import path from 'path';
import { sync as glob } from 'fast-glob';

// POSTS_PATH is useful when you want to get the path to a specific file
export const POSTS_PATH = path.join(process.cwd(), 'post');

// postFilePaths is the list of all mdx files inside the POSTS_PATH directory
export const postFilePaths = glob(`**/*.mdx`).map((name) => path.relative(POSTS_PATH, name));
