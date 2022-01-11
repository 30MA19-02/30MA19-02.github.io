var MAX_VALUE = Number.MAX_VALUE;

let reso_height_slider, reso_width_slider;
let kappa_slider;

let image;
let reso_height, reso_width;
let point_init;
let point_fin;
let trans;
let dist_min = 0;

let model_checkbox, projection_checkbox;

var fps = 10;

function preload() {
  image = loadImage("assets/world_map2.jpg");
}

function setup() {
  createCanvas(600, 600, WEBGL);
  angleMode(RADIANS);

  createP('Sphere').position(width + 10, 10);
  reso_height_slider = new MySlider(2, 32, 32, 1, width + 10, 47, "Height Face");
  reso_width_slider = new MySlider(3, 24, 24, 1, width + 10, 69, "Width Face");

  kappa_slider = new MySlider(-1, +1, 1, 0, width + 10, 230, "Kappa");

  createP('Rotation').position(width + 10, 100);
  trans = new MyPoint(
    new MySlider(-.25, .25, 0.03815754722, 0, width + 10, 135, "BLatitude"),
    new MySlider(-.50, .50, 0.27923107222, 0, width + 10, 157, "BLongitude"),
    new MySlider(-.5, .5, 0, 0, width + 10, 179, "BDirection"),
    kappa_slider
  );

  model_checkbox = createCheckbox('model', true).position(width + 5, 270);
  projection_checkbox = createCheckbox('projection', true).position(width + 5, 300);

  point_init = new Array();
  point_fin = new Array();
  for (var i = 0; i < 33; i++) {
    point_init[i] = new Array();
    point_fin[i] = new Array();
  }

  set_vertices();
  noFill();
  frameRate(fps);
}

function image_scale() {
  return abs(factor());
}
function factor() {
  return 1 / kappa;
}

function set_vertices() {
  reso_height = reso_height_slider.value() + 1, reso_width = reso_width_slider.value();
  kappa = kappa_slider.value() != 0 ? kappa_slider.value() : near_zero;
  for (var i = 0; i < reso_height; i++) {
    for (var j = 0; j < reso_width + 1; j++) {
      point_init[i][j] = new Point(
        - map(j / (reso_width), 0, 1, image_scale() * -0.5, image_scale() * 0.5),
        map(i / (reso_height - 1), 0, 1, image_scale() * -0.25, image_scale() * 0.25),
        0,
        kappa
      );
      point_init[i][j] = point_init[i][j].operate(new Point(
        0,
        0,
        0.75,
        kappa
      ));
    }
  }
}

function draw_manifold() {
  for (let i = 0; i < reso_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < reso_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let [x, y, z] = point_fin[i + k][j];
        if (model_checkbox.checked()) vertex(x, y, z, j / reso_width, 1 - (i + k) / (reso_height - 1));
      }
    }
    endShape();
  }
}

function draw_projection() {
  let sink = factor();
  let source = -factor();
  for (let i = 0; i < reso_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < reso_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let [x, y, z] = point_fin[i + k][j];

        if (x == source) {
          // Point at infinity
          // vertex(h, MAX_VALUE, MAX_VALUE, (i + k) / reso_height, j / reso_width);
          // vertex(h, -MAX_VALUE, MAX_VALUE, (i + k) / reso_height, j / reso_width);
          // vertex(h, MAX_VALUE, -MAX_VALUE, (i + k) / reso_height, j / reso_width);
          // vertex(h, -MAX_VALUE, -MAX_VALUE, (i + k) / reso_height, j / reso_width);
        }
        else {
          //Fix Overlapping
          if (dist(
            x, y, z,
            source, 0, 0
          ) <= dist_min * 1.10)
          //
          {
            endShape();
            beginShape(TRIANGLE_STRIP);
            continue;
          }
          stroke(255, 255, 255);
          if (projection_checkbox.checked()) {
            vertex(
              sink,
              y * (sink - source) / (x - source),
              z * (sink - source) / (x - source),
              j / reso_width,
              1 - (i + k) / (reso_height - 1)
            );
          }
        }
      }
    }
    endShape();
  }
}

function draw() {

  kappa = kappa_slider.value() != 0 ? kappa_slider.value() : near_zero;
  if (kappa > 0) dist_min = MAX_VALUE;
  else dist_min = 0;

  background(0);
  scale(100);
  rotateY(HALF_PI);
  translate(factor(), 0, 0);
  rotateY(PI);

  //slider update
  trans.update();
  reso_height_slider.update();
  reso_width_slider.update();



  if (reso_width_slider.changed || reso_height_slider.changed || kappa_slider.changed) set_vertices();

  for (let i = 0; i < reso_height; i++) {
    for (let j = 0; j < reso_width + 1; j++) {
      point_fin[i][j] = point_init[i][j].operate(
        trans.point
      ).operate(new Point(
        0,
        0,
        -0.25,
        kappa
      )).project;
      point_fin[i][j] = [
        point_fin[i][j]._data[0][0],
        point_fin[i][j]._data[1][0],
        point_fin[i][j]._data[2][0],
      ]
      let [x, y, z] = point_fin[i][j];
      dist_min = min(
        dist_min, dist(
          x, y, z,
          - factor(), 0, 0
        )
      )
    }
  }
  strokeWeight(10);
  stroke(255, 0, 0);
  point(+factor() + 0.01, 0, 0);
  point(+factor() - 0.01, 0, 0);

  if (kappa != 0) {
    stroke(255, 255, 0);
    point(-factor() + 0.01, 0, 0);
    point(-factor() - 0.01, 0, 0);
  }

  textureMode(NORMAL);
  texture(image);

  draw_manifold();

  draw_projection();

  orbitControl();
}
