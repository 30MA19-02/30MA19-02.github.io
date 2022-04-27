import { Html, OrbitControls, PerspectiveCamera, useProgress } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import type { FC } from 'react';
import { Suspense, useContext } from 'react';
import { Color } from 'three';
import type { optionsInterface } from './Options';
import { OptionsContext } from './Options';

const Loading: FC = (prop) => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const Scene_: FC<optionsInterface> = (prop) => {
  const options = prop as optionsInterface;

  const size = useThree((state) => state.size);
  return (
    <>
      {/* <color attach="background" args={[0, 0, 0]} /> */}
      <PerspectiveCamera fov={75} aspect={size.width / size.height} near={0.1} far={1000}>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} enableDamping={false} />
        <mesh>
          <sphereGeometry args={[0.01]} />
          <meshBasicMaterial color={new Color(0xffff00)} />
        </mesh>
      </PerspectiveCamera>
    </>
  );
};

const Scene: FC = (prop) => {
  const options = useContext(OptionsContext)! as optionsInterface;
  return (
    <>
      <Canvas>
        <Suspense fallback={<Loading />}>
          <Scene_ {...options} />
        </Suspense>
      </Canvas>
    </>
  );
};
export default Scene;
