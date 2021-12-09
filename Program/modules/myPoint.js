class Point {
    constructor(x, y){
        this.mat = math.multiply(
            math.matrix([
                [1, 0, 0],
                [0, math.cos(y), -math.sin(y)],
                [0, math.sin(y), math.cos(y)],
            ]),
            math.multiply(
                math.matrix([
                    [math.cos(x), 0, -math.sin(x)],
                    [0, 1, 0],
                    [math.sin(x), 0, math.cos(x)],
                ]),
                math.identity(3)
            )
        )
    }
    project(){
        return math.multiply(
            this.mat,
            math.matrix([
                [0],
                [0],
                [1],
            ])
        )
    }
    operate(other){
        let p = new Point(0,0);
        p.mat = (math.multiply(
            this.mat, other.mat
        ));
        return p;
    }
}

class MyPoint {
    constructor(lat, lon) {
      this.slider = [
          lat,
          lon
      ];
      this.mat = new Point(this.slider[0].value(), this.slider[1].value())
    }
    update(){
        this.slider.forEach((slider)=>slider.update());
        if(this.slider.some((slider)=>slider.changed)){
            this.mat = new Point(this.slider[0].value(), this.slider[1].value());
        }
    }
    project(){
        return this.mat.project();
    }
  }
  