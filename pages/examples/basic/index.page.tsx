import type { NextPage } from 'next';
import Head from 'next/head';
import { Box } from 'theme-ui';
import Example from '.';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
      <Box
        sx={{
          margin: 'auto',
          width: '80vw',
        }}
      >
        <Example />
      </Box>
    </>
  );
};

export default Post;
