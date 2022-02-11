import { FC, useCallback, useEffect, useRef, useState } from "react";

import textureUrl from "./image/world_map2.jpg";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { Point } from "./point";
import { pi } from "mathjs";

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

const Scene: FC<property> = (prop) => {
  const mountPoint = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.Camera | null>(null);
  const renderer = useRef<THREE.Renderer | null>(null);
  const material = useRef<THREE.Material | null>(null);
  const dot = useRef<THREE.Mesh | null>(null);
  const manifold = useRef<THREE.Mesh | null>(null);
  const plane = useRef<THREE.Mesh | null>(null);
  const frameID = useRef<number | null>(null);

  useEffect(() => {
    const width = mountPoint.current!.clientWidth;
    const height = mountPoint.current!.clientHeight;

    const scene_ = new THREE.Scene();
    const camera_ = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer_ = new THREE.WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera_, renderer_.domElement);
    renderer_.setClearColor("#000000");
    renderer_.setSize(width, height);
    camera_.position.setZ(3);

    const texture = new THREE.TextureLoader().load(textureUrl);
    const material_ = new THREE.MeshBasicMaterial({
      map: texture,
      // wireframe: true,
      side: THREE.DoubleSide,
    });

    const dot_ = new THREE.Mesh(
      new THREE.SphereGeometry(0.01),
      new THREE.MeshBasicMaterial({
        color: 0xffff00,
      })
    );

    scene.current = scene_;
    camera.current = camera_;
    renderer.current = renderer_;
    material.current = material_;
    dot.current = dot_;

    mountPoint.current!.prepend(renderer.current.domElement);

    let renderScene = () => {
      scene.current!.rotateY(-pi / 2);
      scene.current!.translateX(-dot.current!.position.x);
      scene.current!.translateY(-dot.current!.position.y);
      scene.current!.translateZ(-dot.current!.position.z);
      renderer.current!.render(scene.current!, camera.current!);
      scene.current!.translateX(+dot.current!.position.x);
      scene.current!.translateY(+dot.current!.position.y);
      scene.current!.translateZ(+dot.current!.position.z);
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

  const calcPoints = useCallback(() => {
    let factor = prop.kappa === 0 ? 1 : 1 / prop.kappa;
    return new Array(prop.width + 1).fill(0).map((_: any, i: number) => {
      let u = i / prop.width;
      return new Array(prop.height + 1).fill(0).map((_: any, j: number) => {
        let v = j / prop.height;
        let x = -Math.abs(factor) * (0.5 - u);
        let y = Math.abs(factor) * 0.5 * (0.5 - v);
        let p = new Point(x, y, 0, prop.kappa);
        p = p.operate(new Point(0, 0, 0.25, prop.kappa));
        return p;
      });
    });
  }, [prop.width, prop.height, prop.kappa]); // Calculate points
  const calcOperator = useCallback(() => {
    return new Point(-prop.lat, -prop.lon, 0, prop.kappa).operate(
      new Point(0, 0, -prop.dir, prop.kappa)
    );
  }, [prop.lat, prop.lon, prop.dir, prop.kappa]); // Calculate operator
  
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
      let i = parseInt((u * prop.width).toString());
      let j = parseInt((v * prop.height).toString());
      let p = points![i][j];
      p = p.operate(operator!);
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
    },
    [prop.width, prop.height, points, operator]
  ); // segment is unnecessary here
  const planeParametric = useCallback(
    (u: number, v: number, target: THREE.Vector3) => {
      let factor = prop.kappa === 0 ? 1 : 1 / prop.kappa;
      let i = parseInt((u * prop.width).toString());
      let j = parseInt((v * prop.height).toString());
      let p = points![i][j];
      p = p.operate(operator!);
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
      target.set(factor, p.projection.x, p.projection.y);
      // For poincare disk model
      // target.set(0, p.projection.x, p.projection.y);
      // For poincare half plane model
      // target.set(-p.projection.y, p.projection.x, factor);
    },
    [prop.width, prop.height, prop.kappa, points, operator]
  ); // segment, kappa is unnecessary here

  useEffect(initPoints, [initPoints]);
  useEffect(initOperator, [initOperator]);
  useEffect(() => {
    let factor = prop.kappa === 0 ? 1 : 1 / prop.kappa;
    dot.current!.position.set(+factor, 0, 0);
    scene.current!.add(dot.current!);
    const manifold_geometry = new ParametricGeometry(
      manifoldParametric,
      prop.width,
      prop.height
    );
    const plane_geometry = new ParametricGeometry(
      planeParametric,
      prop.width,
      prop.height
    );
    manifold.current = new THREE.Mesh(manifold_geometry, material.current!);
    plane.current = new THREE.Mesh(plane_geometry, material.current!);
    if (prop.visman) scene.current!.add(manifold.current);
    if (prop.vispro) scene.current!.add(plane.current);
    manifold_geometry.dispose();
    plane_geometry.dispose();
  }, [
    prop.width,
    prop.height,
    prop.kappa,
    prop.visman,
    prop.vispro,
    manifoldParametric,
    planeParametric,
  ]);

  return (
    <div>
      <div style={{ width: "400px", height: "400px" }} ref={mountPoint}></div>
      {prop.children}
    </div>
  );
};
export default Scene;
