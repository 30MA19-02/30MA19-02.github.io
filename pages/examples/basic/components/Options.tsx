import { useState, createContext } from 'react';

import type { Dispatch, FC, SetStateAction } from 'react';

export interface optionsInterface {
  segment: number[];
  pos: number[];
  dir: number;
  kappa: number;
  vis: boolean[];
  textureURL: string;
}
interface optionsContext extends optionsInterface {
  setSegment: Dispatch<SetStateAction<number[]>>;
  setPos: Dispatch<SetStateAction<number[]>>;
  setDir: Dispatch<SetStateAction<number>>;
  setKappa: Dispatch<SetStateAction<number>>;
  setVis: Dispatch<SetStateAction<boolean[]>>;
  setTextureURL: Dispatch<SetStateAction<string>>;
}

export const OptionsContext = createContext<optionsContext | null>(null);

export const textureGallery = [
  "https://upload.wikimedia.org/wikipedia/commons/8/83/Equirectangular_projection_SW.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/eb/26X26_Alphabet_Letters_Color_Coded.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/f/fd/UV_checker_Map_byValle.jpg",
];

export const OptionsProvider: FC = (props) => {
  const [segment, setSegment] = useState([24, 16]);
  const [pos, setPos] = useState([0.03815754722, 0.27923107222]);
  const [dir, setDir] = useState(0);
  const [kappa, setKappa] = useState(1);
  const [vis, setVis] = useState([true, true]);
  const [textureURL, setTextureURL] = useState<string>(textureGallery[0]);
  return (
    <OptionsContext.Provider
      value={{
        segment,
        setSegment,
        pos,
        setPos,
        dir,
        setDir,
        kappa,
        setKappa,
        vis,
        setVis,
        textureURL,
        setTextureURL,
      }}
    >
      {props.children}
    </OptionsContext.Provider>
  );
};
