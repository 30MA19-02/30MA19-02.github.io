var MAX_VALUE = Number.MAX_VALUE;

let reso_height_slider, reso_width_slider;


let image;
let reso_height, reso_width;
let point_init;
let point_fin;
let trans;

let factor_ = kappa==0? 1:1/kappa;
let factor = Math.abs(factor_);

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
  
  createP('Rotation').position(width + 10, 100);
  trans = new MyPoint(
    new MySlider(-.25 * factor, .25 * factor, 0.03815754722 * factor, 0, width + 10, 135, "BLatitude"),
    new MySlider(-.50 * factor, .50 * factor, 0.27923107222 * factor, 0, width + 10, 157, "BLongitude"),
    new MySlider(-.5, .5, 0, 0, width + 10, 179, "BDirection"),
    );
    
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

function set_vertices(){
  reso_height = reso_height_slider.value() + 1, reso_width = reso_width_slider.value();
  for (var i = 0; i < reso_height; i++) {
    for (var j = 0; j < reso_width; j++) {
      point_init[i][j] = new Point(
        map(j/(reso_width), 0, 1, -0.5, 0.5) * factor,
        - map(i/(reso_height-1), 0, 1, -0.25, 0.25) * factor,
        );
      point_init[i][j] = point_init[i][j].operate(new Point(
        0,
        0,
        0.25,
      ));
    }
  }
}

function draw_manifold(){
  for (let i = 0; i < reso_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < reso_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let [x,y,z] = point_fin[i + k][j % reso_width];

        x*=-1;

        x-=1;

        x*=factor_;
        y*=factor_;
        z*=factor_;
        
        let j2 = (j == reso_width)? (image.width - 1) / image.width: j / reso_width;

        vertex(x, y, z, j2, 1 - (i + k) / (reso_height - 1));
      }
    }
    endShape();
  }
}

function draw_projection(){

  let dist_max = point_fin.reduce(
    (prev_, curr)=>curr.reduce(
        (prev, curr) => max(
          dist(
            0,
            curr[1]* factor_ * (2) / ((-curr[0]-1) + 2),
            curr[2]* factor_ * (2) / ((-curr[0]-1) + 2),
            0, 0, 0
          ),
          prev
        ),
        prev_
    ),
    0
  )

  for (let i = 0; i < reso_height - 1; i++) {
    beginShape(TRIANGLE_STRIP);
    for (let j = 0; j < reso_width + 1; j++) {
      for (let k = 0; k < 2; k++) {
        let [x,y,z] = point_fin[i + k][j % reso_width];
        x *= -1;

        x-=1;

        y/=kappa;
        z/=kappa;
        
        if (x == -2) {
          // Point at infinity
          // vertex(h, MAX_VALUE, MAX_VALUE, (i + k) / reso_height, j / reso_width);
          // vertex(h, -MAX_VALUE, MAX_VALUE, (i + k) / reso_height, j / reso_width);
          // vertex(h, MAX_VALUE, -MAX_VALUE, (i + k) / reso_height, j / reso_width);
          // vertex(h, -MAX_VALUE, -MAX_VALUE, (i + k) / reso_height, j / reso_width);
        }
        else {
          let j2 = (j == reso_width)? (image.width - 1) / image.width: j / reso_width;
          if (dist(0, y * (2) / (x + 2), z * (2) / (x + 2), 0, 0, 0) >= dist_max*0.90) {
            endShape();
            beginShape(TRIANGLE_STRIP);
            continue;
          }
          stroke(255, 255, 255);
          vertex(
            0,
            y * (2) / (x + 2),
            z * (2) / (x + 2),
            j2,
            1 - (i + k) / (reso_height - 1)
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
  rotateZ(PI / 2);
  rotateY(PI / 2);
  scale(-1,1,1);

  //slider update
  trans.update();
  reso_height_slider.update();
  reso_width_slider.update();

  if (reso_width_slider.changed || reso_height_slider.changed) set_vertices();

  for (let i = 0; i < reso_height; i++) {
    for (let j = 0; j < reso_width; j++) {
      point_fin[i][j] = point_init[i][j].operate(
        trans.point
      ).operate(new Point(
        0,
        0,
        -0.25,
      )).project;
      point_fin[i][j] = [
        point_fin[i][j]._data[0][0],
        point_fin[i][j]._data[1][0],
        point_fin[i][j]._data[2][0],
      ]
    }
  }
  strokeWeight(10);
  stroke(255, 0, 0);
  point(0+0.01, 0, 0);

  stroke(255, 255, 0);
  point(-2*factor_-0.01, 0, 0);

  textureMode(NORMAL);
  texture(image);

  draw_manifold();

  draw_projection();
  
  orbitControl();
}
