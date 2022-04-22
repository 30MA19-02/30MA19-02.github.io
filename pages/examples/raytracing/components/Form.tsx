import { OptionsContext } from './Options';
import { useContext } from 'react';
import type { FC } from 'react';

const AppInput: FC = (prop) => {
  const {
    pos: [x, y, z],
    setPos,
    dir: [alp, bet, gam],
    setDir,
    kappa,
    setKappa,
  } = useContext(OptionsContext)!;

  return (
    <form>
    </form>
  );
};
export default AppInput;
