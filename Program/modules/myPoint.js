let kappa = 1;

function sine(theta, kappa = 1) {
  return kappa > 0 ? math.sin(theta * kappa) : math.sinh(theta * kappa);
}
function cosine(theta, kappa = 1) {
  return kappa > 0 ? math.cos(theta * kappa) : math.cosh(theta * kappa);
}

class Point {
  constructor(x, y) {
    this.mat = math.multiply(
      math.matrix([
        [1, 0, 0],
        [0, cosine(y, kappa), -sine(y, kappa)],
        [0, sine(y, kappa), cosine(y, kappa)],
      ]),
      math.multiply(
        math.matrix([
          [cosine(x, kappa), 0, -sine(x, kappa)],
          [0, 1, 0],
          [sine(x, kappa), 0, cosine(x, kappa)],
        ]),
        math.identity(3)
      )
    );
  }
  project() {
    return math.multiply(
      math.multiply(this.mat, math.matrix([[0], [0], [1]])),
      1 / kappa
    );
  }
  operate(other) {
    let p = new Point(0, 0);
    p.mat = math.multiply(this.mat, other.mat);
    return p;
  }
}

class MyPoint {
  constructor(lat, lon) {
    this.slider = [lat, lon];
    this.mat = new Point(this.slider[0].value(), this.slider[1].value());
  }
  update() {
    this.slider.forEach((slider) => slider.update());
    if (this.slider.some((slider) => slider.changed)) {
      this.mat = new Point(this.slider[0].value(), this.slider[1].value());
    }
  }
  project() {
    return this.mat.project();
  }
}
