import type { NextPage } from 'next';
import Head from 'next/head';
import Example from '.';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Not So Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>

      <Example />
    </>
  );
};

export default Post;
