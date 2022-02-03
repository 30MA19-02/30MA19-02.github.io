import "./style.css";
// import textureUrl from "./assets/world_map2.jpg";
import textureUrl from "./assets/uv_grid_opengl.jpg";

import * as THREE from "three";

import * as noneuc from "noneuclid";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

const canvas = document.getElementById("app");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.offsetWidth / canvas.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

const controls = new OrbitControls(camera, renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const height_slider = document.createElement("input");
height_slider.type = "range";
height_slider.max = 32;
height_slider.min = 2;
height_slider.step = 1;
height_slider.value = 32;

const width_slider = document.createElement("input");
width_slider.type = "range";
width_slider.max = 24;
width_slider.min = 3;
width_slider.step = 1;
width_slider.value = 24;

const lat_slider = document.createElement("input");
lat_slider.type = "range";
lat_slider.max = +0.25;
lat_slider.min = -0.25;
lat_slider.step = 1e-18;
lat_slider.value = 0.03815754722;

const lon_slider = document.createElement("input");
lon_slider.type = "range";
lon_slider.max = +0.5;
lon_slider.min = -0.5;
lon_slider.step = 1e-18;
lon_slider.value = 0.27923107222;

const the_slider = document.createElement("input");
the_slider.type = "range";
the_slider.max = +0.5;
the_slider.min = -0.5;
the_slider.step = 1e-18;
the_slider.value = 0;

const kappa_slider = document.createElement("input");
kappa_slider.type = "range";
kappa_slider.max = +1;
kappa_slider.min = -1;
kappa_slider.step = 1e-18;
kappa_slider.value = 0;

document.body.appendChild(height_slider);
document.body.appendChild(width_slider);
document.body.appendChild(lat_slider);
document.body.appendChild(lon_slider);
document.body.appendChild(the_slider);
document.body.appendChild(kappa_slider);

const texture = new THREE.TextureLoader().load(textureUrl);
const textured_material = new THREE.MeshBasicMaterial({
  map: texture,
  // wireframe: true,
  // side: THREE.BackSide,
});
const material = new THREE.MeshBasicMaterial({
  color: 0xff6347,
});
let kappa, factor, factor_, operator;

function render() {
  const manifold_geometry = new ParametricGeometry(
    function (u, v, target) {
      let x = -Math.abs(factor) * 2 * Math.PI * (0.5 - u);
      let y = -Math.abs(factor) * Math.PI * (v - 0.5);
      let p = new noneuc.Point(x, y, 0, kappa);
      p = p.operate(new noneuc.Point(0, 0, Math.PI / 2, kappa));
      p = p.operate(operator);
      let pr = p.project;
      target.set(pr.get([0, 0]), pr.get([1, 0]), -pr.get([2, 0]));
      target = target.multiplyScalar(10);
    },
    parseInt(width_slider.value),
    parseInt(height_slider.value)
  );
  const projection_geometry = new ParametricGeometry(
    function (u, v, target) {
      let x = -Math.abs(factor) * 2 * Math.PI * (0.5 - u);
      let y = -Math.abs(factor) * Math.PI * (v - 0.5);
      let p = new noneuc.Point(x, y, 0, kappa);
      p = p.operate(new noneuc.Point(0, 0, Math.PI / 2, kappa));
      p = p.operate(operator);
      let pr = p.project;
      target.set(pr.get([0, 0]), pr.get([1, 0]), pr.get([2, 0]));
      let scale = (factor + factor) / (target.x + factor);
      target.set(factor, target.y * scale, -target.z * scale);
      target = target.multiplyScalar(10);
    },
    parseInt(width_slider.value),
    parseInt(height_slider.value)
  );
  const manifold = new THREE.Mesh(manifold_geometry, textured_material);
  const projection = new THREE.Mesh(projection_geometry, textured_material);
  const dot_source = new THREE.Mesh(new THREE.SphereGeometry(0.25), material);
  dot_source.position.set(-10 * factor, 0, 0);
  const dot_sink = new THREE.Mesh(new THREE.SphereGeometry(0.25), material);
  dot_sink.position.set(+10 * factor, 0, 0);

  scene.add(manifold);
  scene.add(projection);
  if (kappa != 0) scene.add(dot_source);
  scene.add(dot_sink);

  scene.rotateY(-Math.PI/2);
  scene.translateX(-10 * factor);
  renderer.render(scene, camera);
  scene.translateX(+10 * factor);
  scene.rotateY(+Math.PI/2);

  scene.remove(manifold);
  scene.remove(projection);
  scene.remove(dot_source);
  scene.remove(dot_sink);

  manifold_geometry.dispose();
  projection_geometry.dispose();
}

function animate() {
  requestAnimationFrame(animate);

  kappa = parseFloat(kappa_slider.value);
  factor = kappa == 0 ? 1 : 1 / kappa;
  operator = new noneuc.Point(
    -parseFloat(lat_slider.value) * Math.abs(factor) * 2 * Math.PI,
    -parseFloat(lon_slider.value) * Math.abs(factor) * 2 * Math.PI,
    -parseFloat(the_slider.value) * 2 * Math.PI,
    kappa
  );

  render();
}

animate();
