import type { NextPage } from 'next';
import getConfig from 'next/config';
import Head from 'next/head';
import { ThemeProvider } from 'theme-ui';
import theme from '../styles/theme';

const Post: NextPage = (props) => {
  const { publicRuntimeConfig } = getConfig();
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0; url=${publicRuntimeConfig.basePath}/examples/basic`}/>
      </Head>
      <ThemeProvider theme={theme}>
        <main>
        </main>
      </ThemeProvider>
    </>
  );
};

export default Post;
