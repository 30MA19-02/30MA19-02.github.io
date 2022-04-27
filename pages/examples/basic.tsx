import Input from '@/components/examples/basic/Form';
import { OptionsProvider } from '@/components/examples/basic/Options';
import Scene from '@/components/examples/basic/Scene';
import TeX from '@matejmazur/react-katex';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AspectRatio, Box, Flex, Heading, Paragraph } from 'theme-ui';

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
        <OptionsProvider>
          <AspectRatio
            ratio={16 / 9}
            sx={{
              border: '.5mm solid var(--theme-ui-colors-primary)',
              background: 'var(--theme-ui-colors-background)',
            }}
          >
            <Scene />
          </AspectRatio>
          <Flex>
            <Box p={2}>
              <Heading>Setting</Heading>
              <Input />
            </Box>
            <Box p={2}>
              <Heading>Description</Heading>
              <Heading as="h3">Segments</Heading>
              <Paragraph>Number of subdivisions in latitude-like and lontitude-like dimension.</Paragraph>
              <Heading as="h3">Position</Heading>
              <Paragraph>Latitude, lontitude and up-direction of the origin relative to the manifold.</Paragraph>
              <Heading as="h3">Curvature</Heading>
              <Paragraph>
                Parameter <code>kappa</code> indicating the curvature of such space, have the dimension of{' '}
                <TeX>{String.raw`\textsf{L}^{-1}`}</TeX>.
              </Paragraph>
            </Box>
          </Flex>
        </OptionsProvider>
      </Box>
    </>
  );
};

export default Post;
