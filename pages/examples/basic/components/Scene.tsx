import { Suspense, useContext, useEffect, useMemo, useRef } from 'react';

import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import Point from '../script/point';
import { pi } from 'mathjs';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Html, useProgress } from '@react-three/drei';
import { Color, TextureLoader } from 'three';
import { DoubleSide, FrontSide, BackSide } from 'three';
import { OptionsContext } from '../index.page';
import type { FC } from 'react';
import type { Mesh, Vector3 } from 'three';
import type { optionsInterface } from '../index.page';

function Loader() {
  const { progress } = useProgress()
  return <Html center>{progress} % loaded</Html>
}

const Scene_: FC<optionsInterface> = (prop) => {
  const options = prop as optionsInterface;
  const options_ = useRef<optionsInterface>(options);

  const size = useThree((state) => state.size);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const texture = useLoader(TextureLoader, options.textureURL);
  const dot = useRef<Mesh>(null!);

  const points = useMemo(() => {
    let factor = options.kappa === 0 ? 1 : 1 / options.kappa;
    return new Array(options.segment[0] + 1).fill(0).map((_: any, i: number) => {
      let u = i / options.segment[0];
      return new Array(options.segment[1] + 1).fill(0).map((_: any, j: number) => {
        let v = j / options.segment[1];
        let x = -Math.abs(factor) * (0.5 - u);
        let y = Math.abs(factor) * 0.5 * (0.5 - v);
        let p = new Point(options.kappa, x, y);
        p = p.operate(new Point(options.kappa, 0.25));
        return p;
      });
    });
  }, [options.kappa, options.segment]);
  const operator = useMemo(
    () => new Point(options.kappa, -options.pos[0], -options.pos[1]).operate(new Point(options.kappa, -options.dir)),
    [options.kappa, options.pos, options.dir],
  );
  const operated = useMemo(() => points.map((ps) => ps.map((p) => p.operate(operator))), [points, operator]);

  const manifold = useMemo(
    () =>
      new ParametricGeometry(
        (u: number, v: number, target: Vector3) => {
          let i = parseInt((u * options_.current.segment[0]).toString());
          let j = parseInt((v * options_.current.segment[1]).toString());
          let p = operated[i][j];
          let pr = p.manifold;
          target.set(pr.x, pr.y, pr.z);
        },
        options_.current.segment[0],
        options_.current.segment[1],
      ),
    [operated],
  );
  const projection = useMemo(
    () =>
      new ParametricGeometry(
        (u: number, v: number, target: Vector3) => {
          let factor = options_.current.kappa === 0 ? 1 : 1 / options_.current.kappa;
          let i = parseInt((u * options_.current.segment[0]).toString());
          let j = parseInt((v * options_.current.segment[1]).toString());
          let p = operated[i][j];
          target.set(factor, p.projection.x, p.projection.y);
          // For poincare disk model
          // target.set(0, p.projection.x, p.projection.y);
          // For poincare half plane model
          // target.set(-p.projection.y, p.projection.x, factor);
        },
        options_.current.segment[0],
        options_.current.segment[1],
      ),
    [operated],
  );

  useEffect(() => {
    camera.position.setZ(3);
  }, []);
  useFrame((event) => {
    scene.rotateY(-pi / 2);
    scene.translateX(-dot.current.position.x);
    scene.translateY(-dot.current.position.y);
    scene.translateZ(-dot.current.position.z);
    event.gl.render(scene, camera);
    scene.translateX(+dot.current.position.x);
    scene.translateY(+dot.current.position.y);
    scene.translateZ(+dot.current.position.z);
    scene.rotateY(+pi / 2);
  }, 1);
  useEffect(() => {
    let factor = options.kappa === 0 ? 1 : 1 / options.kappa;
    dot.current.position.set(+factor, 0, 0);
  }, [options.kappa]);
  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <PerspectiveCamera fov={75} aspect={size.width / size.height} near={0.1} far={1000}>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} enableDamping={false} />
        <mesh ref={dot}>
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
      <Canvas style={{ width: '500px', height: '500px' }}>
        <Suspense fallback={<Loader/>}>
          <Scene_ {...options} />
        </Suspense>
      </Canvas>
      {prop.children}
    </>
  );
};
export default Scene;
