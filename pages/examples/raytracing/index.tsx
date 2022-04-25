import type { FC } from 'react';
import { AspectRatio, Box, Flex, Heading, Paragraph } from 'theme-ui';
import Input from './components/Form';
import { OptionsProvider } from './components/Options';
import Scene from './components/Scene';

const app: FC = (props) => {
  return (
    <>
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
export default app;
