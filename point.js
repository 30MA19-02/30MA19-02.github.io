const math = require('mathjs');

function sine(theta, kappa = 1) {
  return kappa == 0 ? theta : kappa > 0 ? math.sin(theta * kappa) : math.sinh(theta * kappa);
}
function cosine(theta, kappa = 1) {
  return kappa == 0 ? 1 : kappa > 0 ? math.cos(theta * kappa) : math.cosh(theta * kappa);
}

class Point {
  constructor(x, y, theta = 0, kappa=1) {
    this.kappa = kappa;
    this.mat = math.multiply(
      math.matrix([
        [1, 0, 0],
        [0, cosine(theta, 1), -sine(theta, 1)],
        [0, sine(theta, 1), cosine(theta, 1)],
      ]),
      math.multiply(
        math.matrix([
          [cosine(x, this.kappa), 0, -sine(x, this.kappa)],
          [0, 1, 0],
          [sine(x, this.kappa), 0, cosine(x, this.kappa)],
        ]),
        math.matrix([
          [cosine(y, this.kappa), -sine(y, this.kappa), 0],
          [sine(y, this.kappa), cosine(y, this.kappa), 0],
          [0, 0, 1],
        ]),
      ),
    );
  }
  project() {
    return math.multiply(
      math.multiply(
        this.mat,
        math.matrix([[-1], [0], [0]]),
      ),
      this.kappa !=0 ? 1 / this.kappa : 1
    );
  }
  operate(other) {
    console.assert(this.constructor === other.constructor && this.kappa == other.kappa, "Invalid point")
    let p = new Point(0, 0);
    p.mat = math.multiply(this.mat, other.mat);
    return p;
  }
}

module.exports = {
  Point
};