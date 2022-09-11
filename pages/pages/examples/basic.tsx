import Input from '@/components/examples/basic/Form';
import { OptionsProvider } from '@/components/examples/basic/Options';
import Scene from '@/components/examples/basic/Scene';
import TeX from '@matejmazur/react-katex';
import type { NextPage } from 'next';
import Head from 'next/head';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
      <div
        style={{
          margin: 'auto',
          width: '80vw',
        }}
      >
        <OptionsProvider>
          <Scene />
          <div
            style={{
              display: 'flex',
            }}
          >
            <div>
              <h2>Setting</h2>
              <Input />
            </div>
            <div>
              <h2>Description</h2>
              <h3>Segments</h3>
              <p>Number of subdivisions in latitude-like and lontitude-like dimension.</p>
              <h3>Position</h3>
              <p>Latitude, lontitude and up-direction of the origin relative to the manifold.</p>
              <h3>Curvature</h3>
              <p>
                Parameter <code>kappa</code> indicating the curvature of such space, have the dimension of{' '}
                <TeX>{String.raw`\textsf{L}^{-1}`}</TeX>.
              </p>
            </div>
          </div>
        </OptionsProvider>
      </div>
    </>
  );
};

export default Post;
