import { OptionsProvider } from './components/Options';
import Input from './components/Form';
import Scene from './components/Scene';
import type { FC } from 'react';
import { AspectRatio, Box, Flex, Heading, Paragraph } from 'theme-ui';
import TeX from '@matejmazur/react-katex';

const app: FC = (props) => {
  return (
    <>
      <OptionsProvider>
        <AspectRatio
          ratio={16/9}
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
    </>
  );
};
export default app;
