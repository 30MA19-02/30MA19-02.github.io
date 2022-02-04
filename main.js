import "./style.css";
import textureUrl from "./assets/world_map2.jpg";
// import textureUrl from "./assets/uv_grid_opengl.jpg";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ParametricGeometry } from "three/examples/jsm/geometries/ParametricGeometry";

import { Point } from "./point";
import { PairedSlider } from "./slider";
import { pi } from "mathjs";

const div = document.body.querySelector("#app");

const canvas = document.createElement("canvas");
canvas.width = 500;
canvas.height = 500;

const height_slider = new PairedSlider();
height_slider.div.id = "height";
height_slider.max = 32;
height_slider.min = 2;
height_slider.step = 1;
height_slider.value = 32;

const width_slider = new PairedSlider();
width_slider.div.id = "width";
width_slider.max = 24;
width_slider.min = 3;
width_slider.step = 1;
width_slider.value = 24;

const lat_slider = new PairedSlider();
lat_slider.div.id = "latitude";
lat_slider.max = +0.25;
lat_slider.min = -0.25;
lat_slider.step = 0;
lat_slider.value = 0.03815754722;

const lon_slider = new PairedSlider();
lon_slider.div.id = "lontitude";
lon_slider.max = +0.5;
lon_slider.min = -0.5;
lon_slider.step = 0;
lon_slider.value = 0.27923107222;

const the_slider = new PairedSlider();
the_slider.div.id = "direction";
the_slider.max = +0.5;
the_slider.min = -0.5;
the_slider.step = 0;
the_slider.value = 0;

const kappa_slider = new PairedSlider();
kappa_slider.div.id = "kappa";
kappa_slider.max = +1;
kappa_slider.min = -1;
kappa_slider.step = 0;
kappa_slider.value = 1;
{
  const param = document.createElement("form");
  const segment_label = document.createElement("label");
  segment_label.textContent = "Segments";
  param.appendChild(segment_label);
  param.appendChild(height_slider.div);
  param.appendChild(width_slider.div);
  const pos_label = document.createElement("label");
  pos_label.textContent = "Position";
  param.appendChild(pos_label);
  param.appendChild(lat_slider.div);
  param.appendChild(lon_slider.div);
  param.appendChild(the_slider.div);
  const kappa_label = document.createElement("label");
  kappa_label.textContent = "Kappa";
  param.appendChild(kappa_label);
  param.appendChild(kappa_slider.div);

  div.appendChild(canvas);
  div.appendChild(param);
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.offsetWidth / canvas.offsetHeight,
  0.01,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

const controls = new OrbitControls(camera, renderer.domElement);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
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

let kappa, factor, width, height, operator;
let manifold, plane, dot;
dot = new THREE.Mesh(new THREE.SphereGeometry(0.01), material);

let points = [];

function render() {
  scene.rotateY(-pi / 2);
  // scene.rotateX(-pi / 2);
  scene.translateX(-dot.position.x);
  scene.translateY(-dot.position.y);
  scene.translateZ(-dot.position.z);
  renderer.render(scene, camera);
  scene.translateX(+dot.position.x);
  scene.translateY(+dot.position.y);
  scene.translateZ(+dot.position.z);
  // scene.rotateX(+pi / 2);
  scene.rotateY(+pi / 2);
}

function setpoints() {
  points = new Array(width + 1).fill(0).map((_, i) => {
    let u = i / width;
    return new Array(height + 1).fill(0).map((_, j) => {
      let v = j / height;
      let x = - Math.abs(factor) * (0.5 - u);
      let y = Math.abs(factor) * 0.5 * (0.5 - v);
      let p = new Point(x, y, 0, kappa);
      p = p.operate(new Point(0,0,0.25,kappa));
      return p;
    });
  });
}

function update() {
  scene.remove(manifold, plane, dot);
  dot.position.set(+factor, 0, 0);
  scene.add(dot);
  let dmax = -1;
  const manifold_geometry = new ParametricGeometry(
    function (u, v, target) {
      let i = parseInt((u * width).toString());
      let j = parseInt((v * height).toString());
      let p = points[i][j];
      p = p.operate(operator);
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
      if (p.projection.length() > dmax) {
        dmax = p.projection.length();
      }
    },
    width,
    height
  );
  const plane_geometry = new ParametricGeometry(
    function (u, v, target) {
      let i = parseInt((u * width).toString());
      let j = parseInt((v * height).toString());
      let p = points[i][j];
      p = p.operate(operator);
      let pr = p.manifold;
      target.set(pr.x, pr.y, pr.z);
      if (p.projection.length() >= dmax) {
        target.setScalar(Infinity);
        return;
      }
      target.set(factor, p.projection.x, p.projection.y);
      // For poincare disk model
      // target.set(0, p.projection.x, p.projection.y);
      // For poincare half plane model
      // target.set(-p.projection.y, p.projection.x, factor);
    },
    width,
    height
  );
  manifold = new THREE.Mesh(manifold_geometry, textured_material);
  plane = new THREE.Mesh(plane_geometry, textured_material);
  scene.add(manifold);
  scene.add(plane);

  render();

  manifold_geometry.dispose();
  plane_geometry.dispose();
}

function animate() {
  requestAnimationFrame(animate);

  let update_ = false;
  kappa_slider.refresh();
  lat_slider.refresh();
  lon_slider.refresh();
  the_slider.refresh();
  width_slider.refresh();
  height_slider.refresh();
  if (width_slider.changed || height_slider.changed) {
    width = parseInt(width_slider.value);
    height = parseInt(height_slider.value);
    update_ = true;
  }
  if (kappa_slider.changed) {
    kappa = parseFloat(kappa_slider.value);
    factor = kappa == 0 ? 1 : 1 / kappa;
    update_ = true;
  }
  if (update_) setpoints();
  if (
    kappa_slider.changed ||
    lat_slider.changed ||
    lon_slider.changed ||
    the_slider.changed
  ) {
    operator = new Point(
      - parseFloat(lat_slider.value), // * Math.abs(factor),
      - parseFloat(lon_slider.value), // * Math.abs(factor),
      0,
      kappa
    ).operate(new Point(0, 0, - parseFloat(the_slider.value), kappa));
    update_ = true;
  }
  if (update_) update();
  else render();
}

animate();
