import type { NextPage } from 'next';
import Head from 'next/head';
import Example from '.';
import TeX from '@matejmazur/react-katex';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
      <main>
        <Example />
        <h2>Description</h2>
        <h3>Segments</h3>
        <p>
          Number of subdivisions in latitude-like and lontitude-like dimension.
        </p>
        <h3>Position</h3>
        <p>
          Latitude, lontitude and up-direction of the origin relative to the manifold.
        </p>
        <h3>Curvature</h3>
        <p>
          Parameter <code>kappa</code> indicating the curvature of such space, have the dimension of <TeX>{String.raw`\textsf{L}^{-1}`}</TeX>.
        </p>
      </main>
    </>
  );
};

export default Post;
