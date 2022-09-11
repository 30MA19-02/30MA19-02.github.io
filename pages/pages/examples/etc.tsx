import type { NextPage } from 'next';
import Head from 'next/head';
import Scene from '@/components/examples/etc/Scene';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Not So Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
      <div
        style={{
          margin: 'auto',
          width: '80vw',
        }}
      >
        <Scene />
      </div>
    </>
  );
};

export default Post;
