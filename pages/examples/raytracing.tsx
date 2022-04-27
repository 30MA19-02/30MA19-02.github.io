import Input from '@/components/examples/raytracing/Form';
import { OptionsProvider } from '@/components/examples/raytracing/Options';
import Scene from '@/components/examples/raytracing/Scene';
import type { NextPage } from 'next';
import Head from 'next/head';
import { AspectRatio, Box, Flex, Heading, Paragraph } from 'theme-ui';

const Post: NextPage = (props) => {
  return (
    <>
      <Head>
        <title>{'Not So Basic example'}</title>
        <meta name="description" content={'Documentation page for noneuclidjs.'} />
      </Head>
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
            <Heading as={'h3'}>Work in Process</Heading>
            <Paragraph>
              To calculate the image, Beltrami–Klein / Gnomonic projection should be used. It map the geodesic into
              straight line and thus will let the renderer work without much modification. Still, the distance should be
              mapped to make it realistic.
            </Paragraph>
            <Paragraph>
              The problem left is how to define shapes. Parametic curve can be used for sphere. Polyhedra, however, may
              need extra work to calculate possible regular polyhedra.
            </Paragraph>
            <Paragraph>All those are just assumption so far and this project might even be terminated.</Paragraph>
          </Box>
        </Flex>
      </OptionsProvider>
    </>
  );
};

export default Post;
