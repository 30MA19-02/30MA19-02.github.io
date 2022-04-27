import type { Dispatch, FC, SetStateAction, ReactNode } from 'react';
import { createContext, useState } from 'react';

interface Iprops {
  children?: ReactNode
}

export interface optionsInterface {
  pos: number[];
  dir: number[];
  kappa: number;
}
interface optionsContext extends optionsInterface {
  setPos: Dispatch<SetStateAction<number[]>>;
  setDir: Dispatch<SetStateAction<number[]>>;
  setKappa: Dispatch<SetStateAction<number>>;
}

export const OptionsContext = createContext<optionsContext | null>(null);

export const OptionsProvider: FC<Iprops> = (props) => {
  const [pos, setPos] = useState([0, 0, 0]);
  const [dir, setDir] = useState([0, 0]);
  const [kappa, setKappa] = useState(0);
  return (
    <OptionsContext.Provider
      value={{
        pos,
        setPos,
        dir,
        setDir,
        kappa,
        setKappa,
      }}
    >
      {props.children??<></>}
    </OptionsContext.Provider>
  );
};
