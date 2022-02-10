import { FC, useCallback, useEffect, useRef, useState } from "react";

import textureUrl from "src/public/image/world_map2.jpg";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { Point } from "src/point";
import { pi } from "mathjs";
import Input from "src/Input";

const Docs: FC = (prop) => {
  const mountPoint = useRef<HTMLDivElement>(null);
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.Camera | null>(null);
  const renderer = useRef<THREE.Renderer | null>(null);
  const material = useRef<THREE.Material | null>(null);
  const dot = useRef<THREE.Mesh | null>(null);
  const manifold = useRef<THREE.Mesh | null>(null);
  const plane = useRef<THREE.Mesh | null>(null);
  const frameID = useRef<number | null>(null);

  const [segment, setSegment] = useState([24, 32]);
  const [pos, setPos] = useState([0.03815754722, 0.27923107222]);
  const [dir, setDir] = useState(0);
  const [kappa, setKappa] = useState(1);
  const [vis, setVis] = useState([true, true]);

  const calcPoints = useCallback(() => {
    let factor = kappa === 0 ? 1 : 1 / kappa;
    let [width, height] = segment;
    return new Array(width + 1).fill(0).map((_: any, i: number) => {
      let u = i / width;
      return new Array(height + 1).fill(0).map((_: any, j: number) => {
        let v = j / height;
        let x = -Math.abs(factor) * (0.5 - u);
        let y = Math.abs(factor) * 0.5 * (0.5 - v);
        let p = new Point(x, y, 0, kappa);
        p = p.operate(new Point(0, 0, 0.25, kappa));
        return p;
      });
    });
  }, [segment, kappa]); // Calculate points
  const calcOperator = useCallback(() => {
    return new Point(-pos[0], -pos[1], 0, kappa).operate(
      new Point(0, 0, -dir, kappa)
    );
  }, [pos, dir, kappa]); // Calculate operator

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
      let [width, height] = segment;
      let i = parseInt((u * width).toString());
      let j = parseInt((v * height).toString());
      let p = points![i][j];
      p = p.operate(operator!);
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
    },
    [segment, points, operator]
  ); // segment is unnecessary here
  const planeParametric = useCallback(
    (u: number, v: number, target: THREE.Vector3) => {
      let [width, height] = segment;
      let factor = kappa === 0 ? 1 : 1 / kappa;
      let i = parseInt((u * width).toString());
      let j = parseInt((v * height).toString());
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
    [segment, kappa, points, operator]
  ); // segment, kappa is unnecessary here

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
    return () => {
      stop();
      mountPoint.current!.removeChild(renderer.current!.domElement);
    };
  }, []); // Initial call
  useEffect(initPoints, [initPoints]);
  useEffect(initOperator, [initOperator]);
  useEffect(() => {
    let factor = kappa === 0 ? 1 : 1 / kappa;
    let [width, height] = segment;
    dot.current!.position.set(+factor, 0, 0);
    scene.current!.add(dot.current!);
    const manifold_geometry = new ParametricGeometry(
      manifoldParametric,
      width,
      height
    );
    const plane_geometry = new ParametricGeometry(
      planeParametric,
      width,
      height
    );
    manifold.current = new THREE.Mesh(manifold_geometry, material.current!);
    plane.current = new THREE.Mesh(plane_geometry, material.current!);
    if (vis[0]) scene.current!.add(manifold.current);
    if (vis[1]) scene.current!.add(plane.current);
    manifold_geometry.dispose();
    plane_geometry.dispose();
  }, [segment, kappa, vis, manifoldParametric, planeParametric]); // segment, kappa is unnecessary here

  return (
  <div style={{ width: "400px", height: "400px" }} ref={mountPoint}>
    <Input
      onChangeWidth={(event)=>setSegment([parseInt(event.target.value), segment[1]])}
      onChangeHeight={(event)=>setSegment([segment[0], parseInt(event.target.value)])}
      onChangeLat={(event)=>setPos([parseInt(event.target.value), pos[1]])}
      onChangeLon={(event)=>setPos([pos[0], parseInt(event.target.value)])}
      onChangeDir={(event)=>setDir(parseFloat(event.target.value))}
      onChangeKappa={(event)=>setKappa(parseFloat(event.target.value))}
      onChangeVis={(event)=>setVis([event.target.checked, event.target.checked])}
      onChangeVisMan={(event)=>setVis([event.target.checked, vis[1]])}
      onChangeVisPro={(event)=>setVis([vis[0], event.target.checked])}
    />
  </div>
  );
};
export default Docs;
