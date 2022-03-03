import { useState, Provider, createContext } from 'react';

import type { Dispatch, FC, SetStateAction } from 'react';
import type { NextPage } from 'next';

import Input from './components/Form';
import Scene from './components/Scene';
import Head from 'next/head';

import initTexture from '/public/image/world_map2.jpg';

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

const OptionsProvider: FC = (props) => {
  const [segment, setSegment] = useState([24, 16]);
  const [pos, setPos] = useState([0.03815754722, 0.27923107222]);
  const [dir, setDir] = useState(0);
  const [kappa, setKappa] = useState(1);
  const [vis, setVis] = useState([true, true]);
  const [textureURL, setTextureURL] = useState(initTexture.src);
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

const App: NextPage = (prop) => {
  const [segment, setSegment] = useState([24, 16]);
  const [pos, setPos] = useState([0.03815754722, 0.27923107222]);
  const [dir, setDir] = useState(0);
  const [kappa, setKappa] = useState(1);
  const [vis, setVis] = useState([true, true]);
  const [textureURL, setTextureURL] = useState(initTexture.src);
  return (
    <>
      <Head>
        <title>Basic Example | Noneuclidjs</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Documentation page for noneuclidjs." />
      </Head>
      <OptionsProvider>
        <Scene>
          <Input />
        </Scene>
      </OptionsProvider>
    </>
  );
};
export default App;
