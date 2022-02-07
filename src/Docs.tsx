import React from "react";

import textureUrl from "./image/world_map2.jpg";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";
import { Point } from "./point";
import { pi } from "mathjs";
// import Input from "./Input";

interface Properties {
  width: number;
  height: number;
  lat: number;
  lon: number;
  dir: number;
  kappa: number;
  vis_man: boolean;
  vis_proj: boolean;
}
interface States {
  points?: Point[][];
  operator?: Point;
}

export default class Scene extends React.Component<Properties, States> {
  static defaultProps: Properties = {
    width: 32,
    height: 24,
    lat: 0.03815754722,
    lon: 0.27923107222,
    dir: 0,
    kappa: 1,
    vis_man: true,
    vis_proj: true,
  };
  public readonly state: States = {};
  scene: THREE.Scene | undefined;
  camera: THREE.PerspectiveCamera | undefined;
  material: THREE.MeshBasicMaterial | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  dot: THREE.Mesh | undefined;
  manifold: THREE.Mesh | undefined;
  plane: THREE.Mesh | undefined;
  mount: HTMLDivElement | null | undefined;
  frameId: number | undefined;

  constructor(props: Properties) {
    super(props);

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.generatePoint = this.generatePoint.bind(this);
    this.generateMesh = this.generateMesh.bind(this);
    this.generateOperator = this.generateOperator.bind(this);

    this.generatePoint();
    this.generateOperator();
  }

  componentDidMount() {
    const width = this.mount!.clientWidth;
    const height = this.mount!.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.setClearColor("#000000");
    renderer.setSize(width, height);
    camera.position.setZ(3);

    const texture = new THREE.TextureLoader().load(textureUrl);
    const textured_material = new THREE.MeshBasicMaterial({
      map: texture,
      // wireframe: true,
      side: THREE.DoubleSide,
    });
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });

    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.01), material);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = textured_material;
    this.dot = dot;

    this.mount!.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount!.removeChild(this.renderer!.domElement);
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }

    this.generateMesh();
  }

  stop() {
    cancelAnimationFrame(this.frameId!);
  }

  animate() {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  generatePoint() {
    let factor = this.props.kappa === 0 ? 1 : 1 / this.props.kappa;
    this.setState({
      points: new Array(this.props.width + 1).fill(0).map(((_: any, i: number) => {
        let u = i / this.props.width;
        return new Array(this.props.height + 1).fill(0).map(((_: any, j: number) => {
          let v = j / this.props.height;
          let x = -Math.abs(factor) * (0.5 - u);
          let y = Math.abs(factor) * 0.5 * (0.5 - v);
          let p = new Point(x, y, 0, this.props.kappa);
          p = p.operate(new Point(0, 0, 0.25, this.props.kappa));
          return p;
        }));
      }))
    });
  }

  generateOperator() {
    this.setState({operator: new Point(
        -this.props.lat,
        -this.props.lon,
        0,
        this.props.kappa
      ).operate(new Point(0, 0, -this.props.dir, this.props.kappa))
    });
  }

  generateMesh() {
    this.scene!.clear();
    let factor = this.props.kappa === 0 ? 1 : 1 / this.props.kappa;
    this.dot!.position.set(+factor, 0, 0);
    this.scene!.add(this.dot!);
    const manifold_geometry = new ParametricGeometry(
      ((u: number, v: number, target: THREE.Vector3) => {
        let i = parseInt((u * this.props.width).toString());
        let j = parseInt((v * this.props.height).toString());
        let p = this.state.points![i][j];
        p = p.operate(this.state.operator!);
        let pr = p.manifold;
        target.set(pr.x, pr.y, pr.z);
        // if (p.projection.length() > dmax) {
        //   dmax = p.projection.length();
        // }
      }),
      this.props.width,
      this.props.height
    );
    const plane_geometry = new ParametricGeometry(
      ((u: number, v: number, target: THREE.Vector3) => {
        let i = parseInt((u * this.props.width).toString());
        let j = parseInt((v * this.props.height).toString());
        let p = this.state.points![i][j];
        p = p.operate(this.state.operator!);
        let pr = p.manifold;
        target.set(pr.x, pr.y, pr.z);
        // if (p.projection.length() >= dmax) {
        //   target.setScalar(Infinity);
        //   return;
        // }
        target.set(factor, p.projection.x, p.projection.y);
        // For poincare disk model
        // target.set(0, p.projection.x, p.projection.y);
        // For poincare half plane model
        // target.set(-p.projection.y, p.projection.x, factor);
      }),
      this.props.width,
      this.props.height
    );
    this.manifold = new THREE.Mesh(manifold_geometry, this.material);
    this.plane = new THREE.Mesh(plane_geometry, this.material);
    if (this.props.vis_man) this.scene!.add(this.manifold);
    if (this.props.vis_proj) this.scene!.add(this.plane);
    manifold_geometry.dispose();
    plane_geometry.dispose();
  }

  renderScene() {
    this.scene!.rotateY(-pi / 2);
    this.scene!.translateX(-this.dot!.position.x);
    this.scene!.translateY(-this.dot!.position.y);
    this.scene!.translateZ(-this.dot!.position.z);
    this.renderer!.render(this.scene!, this.camera!);
    this.scene!.translateX(+this.dot!.position.x);
    this.scene!.translateY(+this.dot!.position.y);
    this.scene!.translateZ(+this.dot!.position.z);
    this.scene!.rotateY(+pi / 2);
  }

  render() {
    return (
      <div
        style={{ width: "400px", height: "400px" }}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}
