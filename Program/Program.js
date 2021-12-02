var r, Ox, Oy;
var h = 50;
var a, b, c, d, z, w;
let img, img1, img2, loading;
var Mw, Mh;
var fps = 10;
let dilatation_slider, rotation_slider, inversion_slider;
let dilatation_old, rotation_old, inversion_old;
let dilatation;
let slider_stop = true;
let myVar;
let abc;

function preload() {
  img = loadImage("assets/ISD_bridge.jpg");
  loading = loadImage("assets/loading.gif");
}

function setup() {
  createCanvas(400, 400);
  
  angleMode(DEGREES);
  frameRate(fps);
  
  setOffset();
  imageSetup();
  
  slider();
  [a,b,c,d] = mobiusSetup(rotation_slider.value(), inversion_slider.value());
}

function setOffset() {
  Ox = width / 2;
  Oy = height / 2;
  r = min(Ox, Oy);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setOffset();
  img2.resize(width, height);
  mobius(1);
}

function imageSetup() {
  imageMode(CENTER);
  let Ml = min(width, height);
  if(img.width>img.height) {
    img.resize(Ml , img.height * Ml / img.width);
  }
  else {
    img.resize(img.width * Ml * img.height / 2, Ml);
  }
  Mw = img.width;
  Mh = img.height;
  
  img1 = createImage(Mw, Mh);
  img1.loadPixels();
  for (let i = 0; i < img.width; i ++) {
    for (let j = 0; j < img.height; j ++) {
      img1.set(i, j, img.get(i, j));
    }
  }
  img1.updatePixels();
  
  img2 = createImage(width, height);
  loading.resize(40, 40);
}

function backgroundSetup() {
  background(211);
  fill(0);
  stroke(128);
  strokeWeight(1);
  for (let t = Oy % h; t < height; t+=h) {
      line(0, t, width, t);
  }
  for (let t = Ox % h; t < width; t+=h) {
      line(t, 0, t, height);
  }
  stroke(90);
  strokeWeight(2.5);
  line(0, Oy, width, Oy);
  line(Ox, 0, Ox, height);
  strokeWeight(20);
  point(Ox,Oy);
}

function slider() {
  txt = createP('Dilatation').position(10, 0);
  dilatation_slider = new MySlider(10.0,1000.0,75.0,80,16);
  dilatation_old = dilatation_slider.value();
  
  txt = createP('Rotation').position(10, 20);
  rotation_slider = new MySlider(0.0,360.0,0.0,80,36);
  rotation_old = rotation_slider.value();
  
  txt = createP('Inversion').position(10, 40);
  inversion_slider = new MySlider(0.0,360.0,1.0,80,56);
  inversion_old = inversion_slider.value();
  console.log(inversion_slider.value());
}

/////////////////////////////////////////////////////////

function draw() {
  backgroundSetup();
  
  sliderChange();
  
  dilatation = dilatation_slider.value() / 100;
  
  
  
  if(isSliderChange()) {
    [a,b,c,d] = mobiusSetup(rotation_slider.value(), inversion_slider.value());
    slider_stop = true;
    clearTimeout(myVar);
    mobius(2); //load sample
    
    rotation_old = rotation_slider.value();
    inversion_old = inversion_slider.value();
  }
  else if(slider_stop == true) {
    image(loading, width - 25, 25);
    myVar = setTimeout(function() {
      mobius(1); //load full image
      slider_stop = false;
    }, 100);
  }
  image(img2, Ox, Oy , img2.width * dilatation, img2.height * dilatation);
 }

/////////////////////////////////////////////////////////


function mobius(p) {
  img2 = createImage(img2.width, img2.height);
  
  img2.loadPixels();
  for (let i = 0; i < img1.width; i += p) {
    for (let j = 0; j < img1.height; j += p) {
      [wx,wy] = mobius2(i - img1.width / 2, j - img1.height / 2);
      if (wx < img2.width && wx >= 0 && wy < img2.height && wy >= 0) img2.set(wx, wy, img1.get(i, j));
    }
  }
  img2.updatePixels();
}

function isSliderChange() {
  return (rotation_old != rotation_slider.value() || inversion_old != inversion_slider.value());
}
function sliderChange() {
  if(dilatation_old != dilatation_slider.value()) dilatation_slider.sliderChange();
  if(rotation_old != rotation_slider.value()) rotation_slider.sliderChange();
  if(inversion_old != inversion_slider.value()) inversion_slider.sliderChange();
  dilatation_slider.textboxChange();
  rotation_slider.textboxChange();
  inversion_slider.textboxChange();
}
function mousePressed() {
  
}

function mouseReleased() {
  
}

function canvasposition(x, y) {
  return [x * r + Ox, -y * r + Oy];
}

function calculateposition(x, y) {
  return [(x - Ox) / r, (- y + Oy) / r];
}
