import matter from 'gray-matter';
import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import Head from 'next/head';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ThemeProvider } from 'theme-ui';
import theme from '../../styles/theme';
import type { ParsedUrlQuery } from 'node:querystring';
import { example_list, example_path } from "./index";
import { loader } from "./examples";
import dynamic from 'next/dynamic';

interface IProps {
  data: { [name: string]: string };
  content: string;
  name: string;
  relpath: string;
}
interface IParams extends ParsedUrlQuery {
  name: string;
}

export async function getStaticPaths() {
  return {
    paths: example_list.map(name => ({ params: { name } })),
    fallback: false,
  };
}
export const getStaticProps: GetStaticProps<IProps, IParams> = async ({ params }) => {
  const { name } = params!;
  const relpath = example_path[name];
  const directory = path.join(process.cwd(), './pages/examples', relpath);
  const fileContents = await fs.readFile(directory, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    props: {
      data,
      content,
      name,
      relpath
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
  const Content = dynamic(()=>loader(props.name), {loading: FallbackContent, ssr: false});
  return (
    <>
      <Head>
        <title>{props.data.title}</title>
        <meta name="description" content={props.data.description} />
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
