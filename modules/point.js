import {sin, sinh, cos, cosh, multiply, matrix} from 'mathjs';

function sine(theta, kappa = 1, s = false) {
  return kappa == 0 ? (s ? 0 : theta) : kappa > 0 ? sin(theta * kappa) : (s ? -sinh(theta * kappa) : sinh(theta * kappa));
}
function cosine(theta, kappa = 1) {
  return kappa == 0 ? 1 : kappa > 0 ? cos(theta * kappa) : cosh(theta * kappa);
}

export class Point {
  constructor(x, y, theta, kappa) {
    this.kappa = kappa;
    this.mat = multiply(
      matrix([
        [1, 0, 0],
        [0, cosine(theta, 1), -sine(theta, 1)],
        [0, sine(theta, 1), cosine(theta, 1)],
      ]),
      multiply(
        matrix([
          [cosine(x, this.kappa), -sine(x, this.kappa, true), 0],
          [sine(x, this.kappa), cosine(x, this.kappa), 0],
          [0, 0, 1],
        ]),
        matrix([
          [cosine(y, this.kappa), 0, -sine(y, this.kappa, true)],
          [0, 1, 0],
          [sine(y, this.kappa), 0, cosine(y, this.kappa)],
        ]),
      ),
    );
  }
  get project() {
    return multiply(
      multiply(
        this.mat,
        matrix([[1], [0], [0]]),
      ),
      this.kappa != 0 ? 1 / this.kappa : 1
    );
  }
  operate(other) {
    console.assert(this.kappa == other.kappa, "Invalid point: This point (" + this.kappa.toString() + ") is not in the same with the other (" + other.kappa.toString() + ").")
    let p = new Point(0, 0, 0, this.kappa);
    p.mat = multiply(
      other.mat,
      this.mat,
    );
    return p;
  }
}
