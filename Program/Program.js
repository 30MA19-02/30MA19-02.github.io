let size = 200;
let pointA, pointB;

function setup() {
  angleMode(RADIANS);
  createCanvas(500, 500, WEBGL);
  pointA = new MyPoint(
    new MySlider(-PI/2, PI/2, 0, 500+10, 16, "ALatitude"),
    new MySlider(-PI, PI, 0, 500+10, 32, "ALongitude"),
  );
  pointB = new MyPoint(
    new MySlider(-PI/2, PI/2, 0, 500+10, 70, "BLatitude"),
    new MySlider(-PI, PI, 0, 500+10, 86, "BLongitude"),
  );
}

function draw() {
  background(0);
  scale(size);
  noFill();
  strokeWeight(1);
  stroke(100);
  sphere(1);
  rotateZ(PI/2);
  stroke(255);
  strokeWeight(10);
  orbitControl();
  debugMode(AXES, size, 0, 0, 0);
  pointA.update();
  pointB.update();
  stroke(255);  // origin
  point(
    0, 
    0, 
    1
  );
  stroke(255,0,0);
  point(
  pointA.project()._data[0][0], 
  pointA.project()._data[1][0], 
  pointA.project()._data[2][0]
  );
  stroke(0,255,0);
  point(
    pointB.project()._data[0][0], 
    pointB.project()._data[1][0], 
    pointB.project()._data[2][0]
    );
  stroke(255,200,0);
  let pointC = pointA.mat.operate(pointB.mat);  // A then B
  point(
    pointC.project()._data[0][0], 
    pointC.project()._data[1][0], 
    pointC.project()._data[2][0]
  );
  stroke(200,255,0);
  let pointD = pointB.mat.operate(pointA.mat);  // B then A
  point(
    pointD.project()._data[0][0], 
    pointD.project()._data[1][0], 
    pointD.project()._data[2][0]
  );
}
