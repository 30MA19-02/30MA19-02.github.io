import { useState } from 'react';

import type { NextPage } from 'next';

import Input from './components/Form';
import Scene from './components/Scene';
import Head from 'next/head';

import initTexture from '/public/image/world_map2.jpg';

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
      <Scene
        width={segment[0]}
        height={segment[1]}
        lat={pos[0]}
        lon={pos[1]}
        dir={dir}
        kappa={kappa}
        visman={vis[0]}
        vispro={vis[1]}
        texture={textureURL}
      >
        <Input
          width={segment[0]}
          height={segment[1]}
          lat={pos[0]}
          lon={pos[1]}
          dir={dir}
          kappa={kappa}
          visman={vis[0]}
          vispro={vis[1]}
          texture={textureURL}
          onChangeWidth={(event) => setSegment([parseInt(event.target.value), segment[1]])}
          onChangeHeight={(event) => setSegment([segment[0], parseInt(event.target.value)])}
          onChangeLat={(event) => setPos([parseFloat(event.target.value), pos[1]])}
          onChangeLon={(event) => setPos([pos[0], parseFloat(event.target.value)])}
          onChangeDir={(event) => setDir(parseFloat(event.target.value))}
          onChangeKappa={(event) => setKappa(parseFloat(event.target.value))}
          onChangeVis={(event) => setVis([event.target.checked, event.target.checked])}
          onChangeVisMan={(event) => setVis([event.target.checked, vis[1]])}
          onChangeVisPro={(event) => setVis([vis[0], event.target.checked])}
          onChangeTexture={(event) => setTextureURL(URL.createObjectURL(event.target.files![0]!))}
        />
      </Scene>
    </>
  );
};
export default App;
