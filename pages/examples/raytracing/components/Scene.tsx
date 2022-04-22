import { useContext } from 'react';

import { OptionsContext } from './Options';
import type { FC } from 'react';
import type { optionsInterface } from './Options';

const Scene: FC = (prop) => {
  const options = useContext(OptionsContext)! as optionsInterface;
  return (
    <>
    </>
  );
};
export default Scene;
