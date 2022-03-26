import matter from 'gray-matter';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import fs from 'fs';
import path from 'node:path';
import { ThemeProvider } from 'theme-ui';
import theme from '../styles/theme';
import type { ParsedUrlQuery } from 'node:querystring';
import { postFilePaths, POSTS_PATH } from '../utils/mdxUtils';
import { MDXRemote } from 'next-mdx-remote';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import components from '../components';

interface IParams extends ParsedUrlQuery {
  name: string[];
}
interface IProps {
  frontMatter: { [name: string]: string };
  content: string;
  source: MDXRemoteSerializeResult;
}
export async function getStaticPaths() {
  const paths = postFilePaths
    // Remove file extensions for page paths
    .map((path) => path.replace(/\.mdx?$/, ''))
    // Map the path into the static paths object required by Next.js
    .map((name) => ({ params: { name: name.split('\\') } }));

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async ({ params }) => {
  const postFilePath = path.join(POSTS_PATH, ...params!.name.slice(0, -1), `${params!.name.slice(-1)[0]}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [
        await import('remark-math').then((module) => module.default),
        await import('remark-mdx-frontmatter').then((module) => module.remarkMdxFrontmatter),
      ],
      rehypePlugins: [
        await import('rehype-mathjax').then((module) => module.default),
        await import('rehype-highlight').then((module) => module.default),
      ],
    },
    scope: data,
  });

  return {
    props: {
      content,
      source: mdxSource,
      frontMatter: data,
    },
  };
};
const Post: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (props) => {
  const FallbackContent = () => (
    <>
      <code>
        <pre>{props.content}</pre>
      </code>
    </>
  );
  return (
    <>
      <Head>
        <title>{props.frontMatter.title}</title>
        <meta name="description" content={props.frontMatter.description} />
      </Head>
      <ThemeProvider theme={theme}>
        <main>
          <MDXRemote {...props.source} components={components} />
        </main>
      </ThemeProvider>
    </>
  );
};

export default Post;
