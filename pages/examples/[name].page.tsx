import matter from 'gray-matter';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ThemeProvider } from 'theme-ui';
import theme from '../../styles/theme';
import type { ParsedUrlQuery } from 'node:querystring';
import contents from "./index";
import dynamic from 'next/dynamic';

interface IProps {
  meta: { [name: string]: string };
  content: string;
  name: string;
}
interface IParams extends ParsedUrlQuery {
  name: string;
}

export async function getStaticPaths() {
  return {
    paths: Object.keys(contents).map(name => ({ params: { name } })),
    fallback: false,
  };
}
export const getStaticProps: GetStaticProps<IProps, IParams> = async ({ params }) => {
  const { name } = params!;
  const directory = path.join(process.cwd(), './pages/examples', contents[name]);
  const fileContents = await fs.readFile(directory, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    props: {
      meta: data,
      content,
      name,
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
  const Content = dynamic(()=>import(contents[props.name])) ?? FallbackContent;
  return (
    <>
      <Head>
        <title>{props.meta.title}</title>
        <meta name="description" content={props.meta.description} />
      </Head>
      <ThemeProvider theme={theme}>
        <main>
          <Content />
        </main>
      </ThemeProvider>
    </>
  );
};

export default Post;
