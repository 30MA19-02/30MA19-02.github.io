// var r, Ox, Oy;
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

let bg;

function preload() {
  img = loadImage("assets/ISD_bridge.jpg");
  loading = loadImage("assets/loading.gif");
}

function setup() {
  createCanvas(400, 400);
  bg = createGraphics(width, height);

  angleMode(DEGREES);
  frameRate(fps);

  imageSetup();
  backgroundSetup();

  sliderSetup();
  [a, b, c, d] = mobiusSetup(rotation_slider.value(), inversion_slider.value());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bg.remove();
  bg = createGraphics(width, height);
  backgroundSetup();
  img2.resize(width, height);
  mobius(1);
}

function imageSetup() {
  imageMode(CENTER);
  let Ml = min(width, height);
  if (img.width > img.height) {
    img.resize(Ml, (img.height * Ml) / img.width);
  } else {
    img.resize((img.width * Ml * img.height) / 2, Ml);
  }
  Mw = img.width;
  Mh = img.height;

  img1 = createImage(Mw, Mh);
  img1.loadPixels();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      img1.set(i, j, img.get(i, j));
    }
  }
  img1.updatePixels();

  img2 = createImage(width, height);
  loading.resize(40, 40);
}

function backgroundSetup() {
  bg.translate(bg.width / 2, bg.height / 2);
  bg.scale(1, -1);
  bg.background(211);
  bg.fill(0);
  bg.stroke(128);
  bg.strokeWeight(1);
  for (let t = 0; t < bg.height / 2; t += h) {
    bg.line(-bg.width / 2, t, bg.width / 2, t);
    bg.line(-bg.width / 2, -t, bg.width / 2, -t);
  }
  for (let t = 0; t < bg.width / 2; t += h) {
    bg.line(t, -bg.height / 2, t, bg.height / 2);
    bg.line(-t, -bg.height / 2, -t, bg.height / 2);
  }
  bg.stroke(90);
  bg.strokeWeight(2.5);
  bg.line(-bg.width / 2, 0, bg.width / 2, 0);
  bg.line(0, -bg.height / 2, 0, bg.height / 2);
  bg.strokeWeight(20);
  bg.point(0, 0);
}

function sliderSetup() {
  dilatation_slider = new MySlider(10.0, 1000.0, 75.0, 10, 16, "Dilatation");
  dilatation_old = dilatation_slider.value();

  rotation_slider = new MySlider(0.0, 360.0, 0.0, 10, 36, "Rotation");
  rotation_old = rotation_slider.value();

  inversion_slider = new MySlider(0.0, 360.0, 1.0, 10, 56, "Inversion");
  inversion_old = inversion_slider.value();
}

/////////////////////////////////////////////////////////

function draw() {
  translate(width / 2, height / 2);
  image(bg, 0, 0);

  sliderUpdate();

  dilatation = dilatation_slider.value() / 100;

  if (isSliderChange()) {
    [a, b, c, d] = mobiusSetup(
      rotation_slider.value(),
      inversion_slider.value()
    );
    slider_stop = true;
    clearTimeout(myVar);
    mobius(2); //load sample

    rotation_old = rotation_slider.value();
    inversion_old = inversion_slider.value();
  } else if (slider_stop == true) {
    image(loading, width - 25, 25);
    myVar = setTimeout(function () {
      mobius(1); //load full image
      slider_stop = false;
    }, 100);
  }
  dilatation_old = dilatation_slider.value();
  image(img2, 0, 0, img2.width * dilatation, img2.height * dilatation);
}

/////////////////////////////////////////////////////////

function mobius(p) {
  img2 = createGraphics(img2.width, img2.height);

  img2.loadPixels();
  for (let i = 0; i < img1.width; i += p) {
    for (let j = 0; j < img1.height; j += p) {
      [wx, wy] = mobius2(i - img1.width / 2, j - img1.height / 2);
    //   if (wx < img2.width && wx >= -img2.width && wy < img2.height && wy >= -img2.height)
        img2.set(wx + img2.width / 2, wy + img2.height / 2, img1.get(i, j));
    }
  }
  img2.updatePixels();
}

function isSliderChange() {
  return rotation_slider.changed || inversion_slider.changed;
}
function sliderUpdate() {
  dilatation_slider.update();
  rotation_slider.update();
  inversion_slider.update();
}
