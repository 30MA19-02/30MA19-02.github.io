import { OptionsProvider } from './components/Options';
import Input from './components/Form';
import Scene from './components/Scene';
import type { FC } from 'react';

const app: FC = () => {
  return (
    <OptionsProvider>
      <Scene />
      <h2>Setting</h2>
      <Input />
    </OptionsProvider>
  );
};
export default app;
