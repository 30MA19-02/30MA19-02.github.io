import type { FC } from 'react';
import { useContext } from 'react';
import { OptionsContext } from './Options';

const AppInput: FC = (prop) => {
  const {
    pos: [x, y, z],
    setPos,
    dir: [alp, bet, gam],
    setDir,
    kappa,
    setKappa,
  } = useContext(OptionsContext)!;

  return <form></form>;
};
export default AppInput;
