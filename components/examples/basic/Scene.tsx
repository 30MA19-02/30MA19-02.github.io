import Point from '@/scripts/examples/basic/point';
import { Html, OrbitControls, PerspectiveCamera, Stats, useProgress } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FC, Suspense, useContext, useEffect, useMemo, useRef } from 'react';
import { Euler, Mesh, Vector3 } from 'three';
import { BackSide, Color, DoubleSide, FrontSide, TextureLoader } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import type { optionsInterface } from './Options';
import { OptionsContext } from './Options';

const Loading: FC = (prop) => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const Scene_: FC<optionsInterface> = (prop) => {
  const options = prop as optionsInterface;

  const size = useThree((state) => state.size);
  const texture = useLoader(TextureLoader, options.textureURL);

  const factor = useMemo(() => (options.kappa === 0 ? 1 : 1 / options.kappa), [options.kappa]);

  const points = useMemo(() => {
    return new Array(options.segment[0] + 1).fill(0).map((_: any, i: number) => {
      const u = i / options.segment[0];
      return new Array(options.segment[1] + 1).fill(0).map((_: any, j: number) => {
        const v = j / options.segment[1];
        const x = -Math.abs(factor) * (0.5 - u);
        const y = Math.abs(factor) * 0.5 * (0.5 - v);
        const p = new Point(options.kappa, x, y).operate(new Point(options.kappa, 0.25));
        return p;
      });
    });
  }, [factor, options.segment]);
  const operator = useMemo(
    () => new Point(options.kappa, -options.pos[0], -options.pos[1]).operate(new Point(options.kappa, -options.dir)),
    [options.kappa, options.pos, options.dir],
  );
  const operated = useMemo(() => points.map((ps) => ps.map((p) => p.operate(operator))), [points, operator]);

  const manifold = useMemo(
    () =>
      new ParametricGeometry(
        (u: number, v: number, target: Vector3) => {
          const i = parseInt((u * options.segment[0]).toString());
          const j = parseInt((v * options.segment[1]).toString());
          const p = operated[i][j];
          const pr = p.manifold;
          target.set(pr.x, pr.y, pr.z);
        },
        options.segment[0],
        options.segment[1],
      ),
    [operated],
  );
  const projection = useMemo(
    () =>
      new ParametricGeometry(
        (u: number, v: number, target: Vector3) => {
          const i = parseInt((u * options.segment[0]).toString());
          const j = parseInt((v * options.segment[1]).toString());
          const p = operated[i][j];
          const pr = p.projection(options.proj);
          target.set(pr.x, pr.y, pr.z);
        },
        options.segment[0],
        options.segment[1],
      ),
    [options.proj, operated],
  );

  return (
    <>
      {/* <color attach="background" args={[0, 0, 0]} /> */}
      <PerspectiveCamera aspect={size.width / size.height} position={new Vector3(0, 0, -factor)} rotation={new Euler(0, -Math.PI/2, 0)} attachArray attachObject>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} enableDamping={false} />
        <mesh position={new Vector3(factor, 0, 0)}>
          <sphereGeometry args={[0.01]} />
          <meshBasicMaterial color={new Color(0xffff00)} />
        </mesh>
        {options.vis[0] ? (
          <mesh geometry={manifold}>
            <meshBasicMaterial map={texture} side={DoubleSide} />
          </mesh>
        ) : (
          <></>
        )}
        {options.vis[1] ? (
          <>
            <mesh geometry={projection}>
              <meshBasicMaterial map={texture} side={FrontSide} />
            </mesh>
            <mesh geometry={projection.clone().translate(-1e-3, 0, 0)}>
              <meshBasicMaterial map={texture} side={BackSide} />
            </mesh>
          </>
        ) : (
          <></>
        )}
      </PerspectiveCamera>
    </>
  );
};

const Scene: FC = (prop) => {
  const options = useContext(OptionsContext)! as optionsInterface;
  return (
    <>
      <Canvas frameloop={'always'}>
        <Suspense fallback={<Loading />}>
          <Scene_ {...options} />
          <Stats />
        </Suspense>
      </Canvas>
    </>
  );
};
export default Scene;
