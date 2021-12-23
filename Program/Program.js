var MAX_VALUE = Number.MAX_VALUE;

let height_face, width_face;
let sphere_height;
let size_slider;

let pointA, pointB;

let img0;
let img1, img_height, img_width;
let img2;

var fps = 10;
let dfp;

function preload() {
  img0 = loadImage("assets/world_map2.jpg");
}

function setup() {
  frameRate(fps);
  angleMode(RADIANS);
  createCanvas(800, 600, WEBGL);

  createP('Camera').position(800 + 10, 5);
  x_angle = new MySlider(-1, 1, 0, 0, 800 + 10, 40, "X Angle");
  y_angle = new MySlider(-1, 1, 0, 0, 800 + 10, 62, "Y Angle");
  size_slider = new MySlider(1, 300, 50, 0, 800 + 10, 84, "Size");

  createP('Sphere').position(800 + 10, 100);
  sphere_height = new MySlider(0, 10, 1, 0, 800 + 10, 135, "Height");
  height_face = new MySlider(2, 32, 32, 1, 800 + 10, 157, "Height Face");
  width_face = new MySlider(3, 24, 24, 1, 800 + 10, 179, "Width Face");

  createP('Rotation').position(800 + 10, 190);
  pointB = new MyPoint(
    new MySlider(-1, 1, 0, 0, 800 + 10, 225, "BLatitude"),
    new MySlider(-1, 1, 0, 0, 800 + 10, 247, "BLongitude"),
  );
  img_height = height_face.value() + 1, img_width = width_face.value();
  img1 = new Array();
  img2 = new Array();
  dfp = new Array();
  for (var i = 0; i < 33; i++) {
    img1[i] = new Array();
    img2[i] = new Array();
    dfp[i] = new Array();
  }
  for (var i = 0; i < img_height; i++) {
    for (var j = 0; j < img_width; j++) {
      img1[i][j] = new Point(PI * ((i + 1) / (img_height - 1) - 0.5 - 1 / (img_height - 1)), 2 * PI * ((j + 1) / (img_width) - 0.5));
    }
  }
}

function draw() {
  let size = size_slider.value();
  background(0);
  scale(size);
  noFill();
  strokeWeight(1);
  stroke(100);
  noStroke();
  rotateZ(PI / 2);
  rotateY(y_angle.value() * PI);
  rotateX(x_angle.value() * PI);
  stroke(255);
  strokeWeight(10);
  //debugMode(AXES, size, 0, 0, 0);

  //slider update
  pointB.update();
  height_face.update();
  width_face.update();
  x_angle.update();
  y_angle.update();
  size_slider.update();
  sphere_height.update();

  img_height = height_face.value() + 1, img_width = width_face.value();
  if (width_face.changed || height_face.changed) {
    for (var i = 0; i < img_height; i++) {
      for (var j = 0; j < img_width; j++) {
        img1[i][j] = new Point(PI * ((i + 1) / (img_height - 1) - 0.5 - 1 / (img_height - 1)), 2 * PI * ((j + 1) / (img_width) - 0.5));
      }
    }
  }
  textureMode(NORMAL);
  texture(img0);
  for (let i = 0; i < img_height; i++) {
    for (let j = 0; j < img_width; j++) {
      img2[i][j] = pointB.mat.operate(img1[i][j]);
      let x = img2[i][j].project()._data[0][0],
        y = img2[i][j].project()._data[1][0],
        z = img2[i][j].project()._data[2][0];
      dfp[i][j] = dist(x, y, z, -1, 0, 0);
    }
  }
  let distMin = MAX_VALUE;
  for (let i = 0; i < img_height; i++) {
    for (let j = 0; j < img_width; j++) {
      distMin = Math.min(distMin, dfp[i][j]);
    }
  }
  for (let i = 0; i < img_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < img_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let x = img2[i + k][j % img_width].project()._data[0][0],
          y = img2[i + k][j % img_width].project()._data[1][0],
          z = img2[i + k][j % img_width].project()._data[2][0];
        let j2;
        if (j == img_width) j2 = (img0.width - 1) / img0.width;
        else j2 = j / img_width;
        vertex(x, y, z, j2, 1 - (i + k) / (img_height - 1));
      }
    }
    endShape();
  }

  stroke(255, 0, 0);
  point(-1, 0, 0);
  let h = sphere_height.value() + 1;
  for (let i = 0; i < img_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < img_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let x = img2[i + k][j % img_width].project()._data[0][0],
          y = img2[i + k][j % img_width].project()._data[1][0],
          z = img2[i + k][j % img_width].project()._data[2][0];
        if (x == -1) {
          vertex(h, MAX_VALUE, MAX_VALUE, (i + k) / img_height, j / img_width);
        }
        else {
          let j2;
          if (j == img_width) j2 = (img0.width - 1) / img0.width;
          else j2 = j / img_width;
          if (dist(x, y, z, -1, 0, 0) <= distMin + 0.01) {
            endShape();
            beginShape(TRIANGLE_STRIP);
            continue;
          }
          stroke(255, 255, 255);
          vertex(h, (h + 1) * y / (x + 1), (h + 1) * z / (x + 1), j2,
            1 - (i + k) / (img_height - 1));
        }
      }
    }
    endShape();
  }
}
