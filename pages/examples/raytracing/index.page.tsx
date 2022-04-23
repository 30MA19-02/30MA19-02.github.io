import type { NextPage } from 'next';
import Head from 'next/head';
import Example from '.';
import TeX from '@matejmazur/react-katex';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Not So Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
      
      <Example />
      <h2>Work in Process</h2>
      <p>
        To calculate the image, Beltrami–Klein / Gnomonic projection should be used. It map the geodesic into straight
        line and thus will let the renderer work without much modification. Still, the distance should be mapped to
        make it realistic.
      </p>
      <p>
        The problem left is how to define shapes. Parametic curve can be used for sphere. Polyhedra, however, may need
        extra work to calculate possible regular polyhedra.
      </p>
      <p>All those are just assumption so far and this project might even be terminated.</p>
    </>
  );
};

export default Post;
