import * as projector from '@/scripts/examples/basic/projection';
import Manifold from '@30ma19-02/noneuclid';
import { Html, OrbitControls, PerspectiveCamera, Stats, useProgress } from '@react-three/drei';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { FC, Suspense, useContext, useMemo } from 'react';
import { BackSide, Color, DoubleSide, Euler, FrontSide, TextureLoader, Vector3 } from 'three';
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

  const [factory, pointFromPosition, pointFromOrientation, factor] = useMemo(() => {
    const manifold = Manifold(2, options.kappa);
    return [
      manifold,
      (x: number, y: number) => manifold.Point.fromPosition([x * 2 * Math.PI, - y * 2 * Math.PI]),
      (a: number) => manifold.Point.fromOrientation([[-a * 2 * Math.PI]]),
      manifold.lambda === 0 ? 1 : 1 / manifold.lambda
    ]
  }, [options.kappa]);

  const points = useMemo(() => {
    const transformation = pointFromOrientation(0.25);
    return new Array(options.segment[0] + 1).fill(0).map((_: any, i: number) => {
      const u = i / options.segment[0];
      return new Array(options.segment[1] + 1).fill(0).map((_: any, j: number) => {
        const v = j / options.segment[1];
        const x = -Math.abs(factor) * (0.5 - u);
        const y = Math.abs(factor) * 0.5 * (0.5 - v);
        const p = pointFromPosition(x, y).transform(transformation);
        return p;
      });
    });
  }, [pointFromPosition, pointFromOrientation, factor, options.segment]);
  const operator = useMemo(
    () => {
      return pointFromPosition(- options.pos[0], - options.pos[1]).transform(pointFromOrientation(- options.dir));
    },
    [pointFromPosition, pointFromOrientation, options.pos, options.dir],
  );
  const operated = useMemo(() => points.map((ps) => ps.map((p) => p.transform(operator))), [points, operator]);

  const manifold = useMemo(
    () =>
      new ParametricGeometry(
        (u: number, v: number, target: Vector3) => {
          const i = parseInt((u * options.segment[0]).toString());
          const j = parseInt((v * options.segment[1]).toString());
          const p = operated[i][j];
          const [x, y, z] = p.project;
          target.set(x, y, z);
        },
        options.segment[0],
        options.segment[1],
      ),
    [operated, options.segment],
  );
  const projection = useMemo(
    () =>
      new ParametricGeometry(
        (u: number, v: number, target: Vector3) => {
          const i = parseInt((u * options.segment[0]).toString());
          const j = parseInt((v * options.segment[1]).toString());
          const p = operated[i][j];
          const pr = projector.projector(options.proj)(factory, p);
          target.set(pr.x, pr.y, pr.z);
        },
        options.segment[0],
        options.segment[1],
      ),
    [options.proj, factory, operated, options.segment],
  );

  return (
    <>
      {/* <color attach="background" args={[0, 0, 0]} /> */}
      <PerspectiveCamera aspect={size.width / size.height} position={new Vector3(0, 0, -factor)} rotation={new Euler(0, -Math.PI / 2, 0)} attachArray attachObject>
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
