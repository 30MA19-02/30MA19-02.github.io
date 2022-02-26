import { FC, Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import Point from '../../../script/examples/basic/point';
import { pi } from 'mathjs';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { Color, Mesh, TextureLoader, Vector3 } from 'three';
import { DoubleSide, FrontSide, BackSide } from 'three';

interface property {
  width: number;
  height: number;
  lat: number;
  lon: number;
  dir: number;
  kappa: number;
  visman: boolean;
  vispro: boolean;
  texture: string;
}

const Scene_: FC<property> = (prop_) => {
  const prop = useRef<property>(prop_);

  const size = useThree((state) => state.size);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const texture = useLoader(TextureLoader, prop_.texture);
  const dot = useRef<Mesh>(null!);

  const calcPoints = useCallback(() => {
    let factor = prop_.kappa === 0 ? 1 : 1 / prop_.kappa;
    return new Array(prop_.width + 1).fill(0).map((_: any, i: number) => {
      let u = i / prop_.width;
      return new Array(prop_.height + 1).fill(0).map((_: any, j: number) => {
        let v = j / prop_.height;
        let x = -Math.abs(factor) * (0.5 - u);
        let y = Math.abs(factor) * 0.5 * (0.5 - v);
        let p = new Point(prop_.kappa, x, y);
        p = p.operate(new Point(prop_.kappa, 0.25));
        return p;
      });
    });
  }, [prop_.width, prop_.height, prop_.kappa]); // Calculate points
  const calcOperator = useCallback(() => {
    return new Point(prop_.kappa, -prop_.lat, -prop_.lon).operate(new Point(prop_.kappa, -prop_.dir));
  }, [prop_.lat, prop_.lon, prop_.dir, prop_.kappa]); // Calculate operator

  const [points, setPoints] = useState<Point[][]>(calcPoints);
  const [operator, setOperator] = useState<Point>(calcOperator);

  const calcOperated = useCallback(() => {
    return points.map((ps) => ps.map((p) => p.operate(operator)));
  }, [points, operator]); // Calculate operated

  const [operated, setOperated] = useState<Point[][]>(calcOperated);

  const manifoldParametric = useCallback(
    (u: number, v: number, target: Vector3) => {
      let i = parseInt((u * prop.current.width).toString());
      let j = parseInt((v * prop.current.height).toString());
      let p = operated[i][j];
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
    },
    [operated],
  );
  const planeParametric = useCallback(
    (u: number, v: number, target: Vector3) => {
      let factor = prop.current.kappa === 0 ? 1 : 1 / prop.current.kappa;
      let i = parseInt((u * prop.current.width).toString());
      let j = parseInt((v * prop.current.height).toString());
      let p = operated[i][j];
      target.set(factor, p.projection.x, p.projection.y);
      // For poincare disk model
      // target.set(0, p.projection.x, p.projection.y);
      // For poincare half plane model
      // target.set(-p.projection.y, p.projection.x, factor);
    },
    [operated],
  );

  const [manifold, setManifold] = useState(
    () => new ParametricGeometry(manifoldParametric, prop.current.width, prop.current.height),
  );
  const [plane, setPlane] = useState(
    () => new ParametricGeometry(planeParametric, prop.current.width, prop.current.height),
  );

  useEffect(() => {
    prop.current = prop_;
  }, [prop_]);
  useEffect(() => {
    setPoints(calcPoints());
  }, [calcPoints]);
  useEffect(() => {
    setOperator(calcOperator());
  }, [calcOperator]);
  useEffect(() => {
    setOperated(calcOperated());
  }, [calcOperated]);

  useEffect(()=>{
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
    let factor = prop_.kappa === 0 ? 1 : 1 / prop_.kappa;
    dot.current.position.set(+factor, 0, 0);
  }, [prop_.kappa]);
  useEffect(()=>{
    setManifold(new ParametricGeometry(manifoldParametric, prop.current.width, prop.current.height));
  }, [manifoldParametric]);
  useEffect(()=>{
    setPlane(new ParametricGeometry(planeParametric, prop.current.width, prop.current.height));
  }, [planeParametric]);
  return (
    <>
      <color attach="background" args={[0, 0, 0]} />
      <PerspectiveCamera fov={75} aspect={size.width / size.height} near={0.1} far={1000}>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} enableDamping={false}/>
        <mesh ref={dot}>
          <sphereGeometry args={[0.01]} />
          <meshBasicMaterial color={new Color(0xffff00)} />
        </mesh>
        {prop_.visman ? (
          <mesh geometry={manifold}>
            <meshBasicMaterial map={texture} side={DoubleSide} />
          </mesh>
        ) : (
          <></>
        )}
        {prop_.vispro ? (
          <>
            <mesh geometry={plane}>
              <meshBasicMaterial map={texture} side={FrontSide} />
            </mesh>
            <mesh geometry={plane.clone().translate(-1e-3, 0, 0)}>
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

const Scene: FC<property> = (prop_) => {
  const {children, ...prop} = prop_;
  return (
    <>
      <Canvas style={{ width: '500px', height: '500px' }}>
        <Suspense fallback={null}>
          <Scene_ {...prop} />
        </Suspense>
      </Canvas>
      {children}
    </>
  );
};
export default Scene;
