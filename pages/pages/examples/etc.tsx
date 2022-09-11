import type { NextPage } from 'next';
import Head from 'next/head';
import Scene from '@/components/examples/etc/Scene';
import { AspectRatio, Box } from 'theme-ui';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Not So Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
      <Box
        sx={{
          margin: 'auto',
          width: '80vw',
        }}
      >
        <AspectRatio
          ratio={1 / 1}
          sx={{
            border: '.5mm solid var(--theme-ui-colors-primary)',
            background: 'var(--theme-ui-colors-background)',
          }}
        >
          <Scene />
        </AspectRatio>
      </Box>
      <h1>Description</h1>
      <h3>Work in Process</h3>
      <p>
        To calculate the image, Beltrami–Klein / Gnomonic projection should be used. It map the geodesic into
        straight line and thus will let the renderer work without much modification. Still, the distance should be
        mapped to make it realistic.
      </p>
      <p>
        The problem left is how to define shapes. Parametic curve can be used for sphere. Polyhedra, however, may
        need extra work to calculate possible regular polyhedra.
      </p>
      <p>All those are just assumption so far and this project might even be terminated.</p>
    </>
  );
};

export default Post;
