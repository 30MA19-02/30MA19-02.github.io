let kappa = 1;
class Point extends noneuc.Point {
  constructor(x, y, theta = 0) {
    super(x, y, theta, kappa)
  }
}

class MyPoint {
  constructor(lat, lon, dir) {
    this.slider = [lat, lon, dir];
    this.point = new Point(
      this.slider[0].value() * TWO_PI,
      this.slider[1].value() * TWO_PI,
      this.slider[2].value() * TWO_PI,
    );
  }
  update() {
    this.slider.forEach((slider) => slider.update());
    if (this.slider.some((slider) => slider.changed)) {
      this.point = new Point(
        this.slider[0].value() * TWO_PI,
        this.slider[1].value() * TWO_PI,
        this.slider[2].value() * TWO_PI,
      );
    }
  }
  project() {
    return this.mat.project();
  }
  operate(other) {
    // other: Point
    return this.mat.operate(other);
  }
}
