var MAX_VALUE = Number.MAX_VALUE;

let height_face, width_face;

let pointA, pointB;

let img0;
let img1, img_height, img_width;
let img2;

var fps = 10;

function preload() {
  img0 = loadImage("assets/world_map2.jpg");
}

function setup() {
  frameRate(fps);
  angleMode(RADIANS);
  createCanvas(600, 600, WEBGL);

  createP('Sphere').position(width + 10, 10);
  height_face = new MySlider(2, 32, 32, 1, width + 10, 47, "Height Face");
  width_face = new MySlider(3, 24, 24, 1, width + 10, 69, "Width Face");

  createP('Rotation').position(width + 10, 100);
  pointB = new MyPoint(
    new MySlider(-.25, .25, 0.03815754722, 0, width + 10, 135, "BLatitude"),
    new MySlider(-.5, .5, 0.27923107222, 0, width + 10, 157, "BLongitude"),
    new MySlider(-.5, .5, 0, 0, width + 10, 179, "BDirection"),
  );
  img_height = height_face.value() + 1, img_width = width_face.value();
  img1 = new Array();
  img2 = new Array();
  for (var i = 0; i < 33; i++) {
    img1[i] = new Array();
    img2[i] = new Array();
  }
  set_vertices();
}

function set_vertices(){
  for (var i = 0; i < img_height; i++) {
    for (var j = 0; j < img_width; j++) {
      img1[i][j] = new Point(
        map(j/(img_width), 0, 1, -0.5, 0.5),
        - map(i/(img_height-1), 0, 1, -0.25, 0.25),
        );
      img1[i][j] = img1[i][j].operate(new Point(
        0,
        0,
        0.25,
      ));
    }
  }
}

function draw_manifold(){
  for (let i = 0; i < img_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < img_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let project = img2[i + k][j % img_width].project;
        let x = project._data[0][0],
            y = project._data[1][0],
            z = project._data[2][0];
        
        let j2 = (j == img_width)? (img0.width - 1) / img0.width: j / img_width;

        vertex(x, y, z, j2, 1 - (i + k) / (img_height - 1));
      }
    }
    endShape();
  }
}

function draw_projection(){
  let distMin = MAX_VALUE;
  for (let i = 0; i < img_height; i++) {
    for (let j = 0; j < img_width; j++) {
      let project = img2[i][j].project;
      let x = project._data[0][0],
          y = project._data[1][0],
          z = project._data[2][0];
      distMin = Math.min(distMin, dist(x, y, z, -1, 0, 0));
    }
  }

  let h = +1;
  for (let i = 0; i < img_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < img_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let project = img2[i + k][j % img_width].project;
        let x = project._data[0][0],
            y = project._data[1][0],
            z = project._data[2][0];
        if (x == -1) {
          vertex(h, MAX_VALUE, MAX_VALUE, (i + k) / img_height, j / img_width);
        }
        else {
          let j2 = (j == img_width)? (img0.width - 1) / img0.width: j / img_width;
          if (dist(x, y, z, -1, 0, 0) <= distMin + 0.01) {
            endShape();
            beginShape(TRIANGLE_STRIP);
            continue;
          }
          stroke(255, 255, 255);
          vertex(
            h,
            (h + 1) * y / (x + 1),
            (h + 1) * z / (x + 1),
            j2,
            1 - (i + k) / (img_height - 1)
          );
        }
      }
    }
    endShape();
  }
}

function draw() {
  background(0);
  scale(100);
  noFill();
  strokeWeight(1);
  stroke(100);
  noStroke();
  rotateZ(PI / 2);
  stroke(255);
  strokeWeight(10);

  //slider update
  pointB.update();
  height_face.update();
  
  width_face.update();

  img_height = height_face.value() + 1, img_width = width_face.value();
  if (width_face.changed || height_face.changed) set_vertices();

  for (let i = 0; i < img_height; i++) {
    for (let j = 0; j < img_width; j++) {
      img2[i][j] = img1[i][j].operate(pointB.point).operate(new Point(
        0,
        0,
        -0.25,
      ));
    }
  }

  stroke(255, 0, 0);
  point(-1, 0, 0);

  textureMode(NORMAL);
  texture(img0);

  draw_manifold();

  draw_projection();
  
  orbitControl();
}
