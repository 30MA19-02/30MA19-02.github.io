define(
    ['noneuclid'], 
    function(noneuclid) {
    'use strict';

    const near_zero = 0.0064;

    class Point extends noneuclid.Point {
        constructor(lat, lon, dir, kappa) {
            super(
            lon * 2 * Math.PI,
            - lat * 2 * Math.PI,
            - dir * 2 * Math.PI,
            kappa
            )
        }
    }

    class MyPoint {
        constructor(lat, lon, dir, kappa) {
            this.slider = [lat, lon, dir, kappa];
            this.point = new Point(
            this.slider[0].value(),
            this.slider[1].value(),
            this.slider[2].value(),
            this.slider[3].value() != 0 ? this.slider[3].value() : near_zero,
            );
        }
        update() {
            this.slider.forEach((slider) => slider.update());
            if (this.slider.some((slider) => slider.changed)) {
            this.point = new Point(
                this.slider[0].value(),
                this.slider[1].value(),
                this.slider[2].value(),
                this.slider[3].value() != 0 ? this.slider[3].value() : near_zero,
            );
            }
        }
        operate(other) {
            // other: Point
            return this.point.operate(other);
        }
    }

    return {
        near_zero: near_zero,
        Point: Point,
        MyPoint: MyPoint
    };
}
);