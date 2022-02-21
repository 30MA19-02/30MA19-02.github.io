import { FC, Fragment, useCallback, useEffect, useRef, useState } from 'react';

import textureUrl from './image/world_map2.jpg';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import Point from './point';
import { pi } from 'mathjs';

interface property {
  width: number;
  height: number;
  lat: number;
  lon: number;
  dir: number;
  kappa: number;
  visman: boolean;
  vispro: boolean;
}

const Scene: FC<property> = (prop_) => {
  const prop = useRef<property>(prop_);

  const mountPoint = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.Camera | null>(null);
  const renderer = useRef<THREE.Renderer | null>(null);
  const controls = useRef<OrbitControls | null>(null);
  const texture = useRef<THREE.Texture | null>(null);
  const frameID = useRef<number | null>(null);

  const dot = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(
    new THREE.Mesh(new THREE.SphereGeometry(0.01)),
  );
  const manifold = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(new THREE.Mesh());
  const plane = useRef<THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>>(new THREE.Mesh());

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

  const initPoints = useCallback(() => {
    setPoints(calcPoints());
  }, [calcPoints]); // Update points
  const initOperator = useCallback(() => {
    setOperator(calcOperator());
  }, [calcOperator]); // Update operator

  const manifoldParametric = useCallback(
    (u: number, v: number, target: THREE.Vector3) => {
      let i = parseInt((u * prop.current.width).toString());
      let j = parseInt((v * prop.current.height).toString());
      let p = points![i][j];
      p = p.operate(operator!);
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
    },
    [points, operator],
  ); // segment is unnecessary here
  const planeParametric = useCallback(
    (u: number, v: number, target: THREE.Vector3) => {
      let factor = prop.current.kappa === 0 ? 1 : 1 / prop.current.kappa;
      let i = parseInt((u * prop.current.width).toString());
      let j = parseInt((v * prop.current.height).toString());
      let p = points![i][j];
      p = p.operate(operator!);
      target.set(factor, p.projection.x, p.projection.y);
      // For poincare disk model
      // target.set(0, p.projection.x, p.projection.y);
      // For poincare half plane model
      // target.set(-p.projection.y, p.projection.x, factor);
    },
    [points, operator],
  ); // segment, kappa is unnecessary here

  useEffect(() => {
    prop.current = prop_;
  }, [prop_]);
  useEffect(() => {
    const width = mountPoint.current!.clientWidth;
    const height = mountPoint.current!.clientHeight;

    const scene_ = new THREE.Scene();
    const camera_ = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer_ = new THREE.WebGLRenderer({ antialias: true });
    const controls_ = new OrbitControls(camera_, renderer_.domElement);
    renderer_.setClearColor('#000000');
    renderer_.setSize(width, height);
    camera_.position.setZ(3);

    const texture_ = new THREE.TextureLoader().load(textureUrl);

    scene.current = scene_;
    camera.current = camera_;
    camera.current.layers.enableAll();
    renderer.current = renderer_;
    controls.current = controls_;
    texture.current = texture_;

    dot.current.material.color = new THREE.Color(0xffff00);
    dot.current.layers.set(0);
    scene.current.add(dot.current);

    manifold.current.material.side = THREE.DoubleSide;
    manifold.current.material.map = texture.current;
    manifold.current.layers.set(1);
    scene.current.add(manifold.current);

    plane.current.material.side = THREE.DoubleSide;
    plane.current.material.map = texture.current;
    plane.current.layers.set(2);
    scene.current.add(plane.current);

    mountPoint.current!.prepend(renderer.current.domElement);

    let renderScene = () => {
      scene.current!.rotateY(-pi / 2);
      scene.current!.translateX(-dot.current.position.x);
      scene.current!.translateY(-dot.current.position.y);
      scene.current!.translateZ(-dot.current.position.z);
      renderer.current!.render(scene.current!, camera.current!);
      scene.current!.translateX(+dot.current.position.x);
      scene.current!.translateY(+dot.current.position.y);
      scene.current!.translateZ(+dot.current.position.z);
      scene.current!.rotateY(+pi / 2);
    };
    let animate = () => {
      renderScene();
      frameID.current = window.requestAnimationFrame(animate);
    };

    let start = () => {
      if (!frameID.current) {
        frameID.current = requestAnimationFrame(animate);
      }
    };
    let stop = () => {
      cancelAnimationFrame(frameID.current!);
    };

    start();
    let mountPoint_ = mountPoint.current!;
    return () => {
      stop();
      mountPoint_.removeChild(renderer.current!.domElement);
    };
  }, []); // Initial call
  useEffect(initPoints, [initPoints]);
  useEffect(initOperator, [initOperator]);
  useEffect(() => {
    scene.current!.remove(manifold.current);
    manifold.current.geometry.dispose();
    manifold.current.geometry = new ParametricGeometry(manifoldParametric, prop.current.width, prop.current.height);
    scene.current!.add(manifold.current);
  }, [manifoldParametric]); // Change manifold, segment is unnecessary here
  useEffect(() => {
    scene.current!.remove(plane.current);
    plane.current.geometry.dispose();
    plane.current.geometry = new ParametricGeometry(planeParametric, prop.current.width, prop.current.height);
    scene.current!.add(plane.current);
  }, [planeParametric]); // Change projection, segment is unnecessary here
  useEffect(() => {
    manifold.current.material.map?.dispose();
    manifold.current.material.map = texture.current;
    plane.current.material.map?.dispose();
    plane.current.material.map = texture.current;
  }, [texture]); // Change material
  useEffect(() => {
    scene.current!.remove(dot.current);
    let factor = prop_.kappa === 0 ? 1 : 1 / prop_.kappa;
    dot.current.position.set(+factor, 0, 0);
    scene.current!.add(dot.current);
  }, [prop_.kappa]); // Move dot according to kappa
  useEffect(() => {
    if (prop_.visman) camera.current!.layers.enable(1);
    if (!prop_.visman) camera.current!.layers.disable(1);
  }, [prop_.visman]); // Show / hide manifold
  useEffect(() => {
    if (prop_.vispro) camera.current!.layers.enable(2);
    if (!prop_.vispro) camera.current!.layers.disable(2);
  }, [prop_.vispro]); // Show / hide projection

  return (
    <Fragment>
      <div style={{ width: '400px', height: '400px' }} ref={mountPoint}></div>
      {prop_.children}
    </Fragment>
  );
};
export default Scene;
