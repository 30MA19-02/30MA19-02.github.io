import { Html, OrbitControls, PerspectiveCamera, useProgress } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { FC, useCallback } from 'react';
import { Suspense, useContext, useEffect, useMemo, useRef } from 'react';
import type { Mesh, Vector3 } from 'three';
import { BackSide, Color, DoubleSide, FrontSide, TextureLoader } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import Point from '../script/point';
import { projectionType } from '../script/projection';
import type { optionsInterface } from './Options';
import { OptionsContext } from './Options';

const Loading: FC = (prop) => {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
};

const Scene_: FC<optionsInterface> = (prop) => {
  const options = prop as optionsInterface;

  const size = useThree((state) => state.size);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const texture = useLoader(TextureLoader, options.textureURL);
  const dot = useRef<Mesh>(null!);

  const projector = useCallback(
    async (point: Point) => {
      const sph = point.kappa >= 0;
      switch (options.proj) {
        case projectionType.equirectangular:
          // Remove border
          return (await import('../script/projection/equirectangular')).default(point);

        case projectionType.orthographic:
          // Remove overlapxping
          return sph
            ? (await import('../script/projection/orthographic')).default(point)
            : (await import('../script/projection/klein')).default(point);

        case projectionType.gnomonic:
          return sph
            ? (await import('../script/projection/gnomonic')).default(point)
            : (await import('../script/projection/gans')).default(point);

        case projectionType.stereographic:
          // Remove infinitex
          return sph
            ? (await import('../script/projection/stereographic')).default(point)
            : (await import('../script/projection/poincare')).default(point);

        case projectionType.halfplane:
          // Autoreplce Euclideanr
          return (await import('../script/projection/halfplane')).default(point);

        case projectionType.hemishere:
          return (await import('../script/projection/hemi')).default(point);

        default:
          throw new RangeError('Invalid projection type');
      }
    },
    [options.proj],
  );

  const factor = useMemo(() => (options.kappa === 0 ? 1 : 1 / options.kappa), [options.kappa]);

  const points = useMemo(() => {
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
          let i = parseInt((u * options.segment[0]).toString());
          let j = parseInt((v * options.segment[1]).toString());
          let p = operated[i][j];
          let pr = p.manifold;
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
          let i = parseInt((u * options.segment[0]).toString());
          let j = parseInt((v * options.segment[1]).toString());
          let p = operated[i][j];
          let pr = projector(p);
          pr.then((pr) => target.set(pr.x, pr.y, pr.z));
        },
        options.segment[0],
        options.segment[1],
      ),
    [options.proj, operated],
  );

  useEffect(() => {
    camera.position.setZ(3);
  }, []);
  useFrame((event) => {
    scene.rotateY(-Math.PI / 2);
    scene.translateX(-dot.current.position.x);
    scene.translateY(-dot.current.position.y);
    scene.translateZ(-dot.current.position.z);
    event.gl.render(scene, camera);
    scene.translateX(+dot.current.position.x);
    scene.translateY(+dot.current.position.y);
    scene.translateZ(+dot.current.position.z);
    scene.rotateY(+Math.PI / 2);
  }, 1);
  useEffect(() => {
    dot.current.position.set(+factor, 0, 0);
  }, [factor]);
  return (
    <>
      {/* <color attach="background" args={[0, 0, 0]} /> */}
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
      <Canvas>
        <Suspense fallback={<Loading />}>
          <Scene_ {...options} />
        </Suspense>
      </Canvas>
    </>
  );
};
export default Scene;
