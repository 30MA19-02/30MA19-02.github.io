let kappa = 1;
class Point extends noneuc.Point {
  constructor(lat, lon, dir = 0) {
    super(
      lat * TWO_PI,
      - lon * TWO_PI,
      dir * TWO_PI,
      kappa)
    }
    project() {
    console.log("H");
    let proj = super.project();
    let proj_ = [
      proj._data[0][0],
      proj._data[1][0],
      proj._data[2][0],
    ];
    return proj_;
  }
}

class MyPoint {
  constructor(lat, lon, dir) {
    this.slider = [lat, lon, dir];
    this.point = new Point(
      this.slider[0].value(),
      this.slider[1].value(),
      this.slider[2].value(),
    );
  }
  update() {
    this.slider.forEach((slider) => slider.update());
    if (this.slider.some((slider) => slider.changed)) {
      this.point = new Point(
        this.slider[0].value(),
        this.slider[1].value(),
        this.slider[2].value(),
      );
    }
  }
  operate(other) {
    // other: Point
    return this.point.operate(other);
  }
}
