define(
    ['p5', './point', './slider'], 
    function(p5, point, slider) {
        'use strict';

        const sketch = (p) => {
            var MAX_VALUE = Number.MAX_VALUE;

            let reso_height_slider, reso_width_slider;
            let kappa_slider;
            let kappa;

            let image;
            let reso_height, reso_width;
            let point_init;
            let point_fin;
            let trans;
            let dist_min = 0;

            let model_checkbox, projection_checkbox;

            var fps = 10;

            p.preload = function () {
            image = p.loadImage("assets/world_map2.jpg");
            }

            p.setup = function () {
            p.createCanvas(600, 600, p.WEBGL);
            p.angleMode(p.RADIANS);

            p.createP('Sphere').position(p.width + 10, 10);
            reso_height_slider = new slider.MySlider(2, 32, 32, 1, p.width + 10, 47, p, "Height Face");
            reso_width_slider = new slider.MySlider(3, 24, 24, 1, p.width + 10, 69, p, "Width Face");

            kappa_slider = new slider.MySlider(-1, +1, 1, 0, p.width + 10, 230, p, "Kappa");

            p.createP('Rotation').position(p.width + 10, 100);
            trans = new point.MyPoint(
                new slider.MySlider(-.25, .25, 0.03815754722, 0, p.width + 10, 135, p, "BLatitude"),
                new slider.MySlider(-.50, .50, 0.27923107222, 0, p.width + 10, 157, p, "BLongitude"),
                new slider.MySlider(-.5, .5, 0, 0, p.width + 10, 179, p, "BDirection"),
                kappa_slider
            );

            model_checkbox = p.createCheckbox('model', true).position(p.width + 5, 270);
            projection_checkbox = p.createCheckbox('projection', true).position(p.width + 5, 300);

            point_init = new Array();
            point_fin = new Array();
            for (var i = 0; i < 33; i++) {
                point_init[i] = new Array();
                point_fin[i] = new Array();
            }

            set_vertices();
            p.noFill();
            p.frameRate(fps);
            }

            function image_scale() {
            return Math.abs(factor());
            }
            function factor() {
            return 1 / kappa;
            }

            function set_vertices() {
            reso_height = reso_height_slider.value() + 1, reso_width = reso_width_slider.value();
            kappa = kappa_slider.value() != 0 ? kappa_slider.value() : point.near_zero;
            for (var i = 0; i < reso_height; i++) {
                for (var j = 0; j < reso_width + 1; j++) {
                point_init[i][j] = new point.Point(
                    - p.map(j / (reso_width), 0, 1, image_scale() * -0.5, image_scale() * 0.5),
                    p.map(i / (reso_height - 1), 0, 1, image_scale() * -0.25, image_scale() * 0.25),
                    0,
                    kappa
                );
                point_init[i][j] = point_init[i][j].operate(new point.Point(
                    0,
                    0,
                    0.75,
                    kappa
                ));
                }
            }
            }

            function draw_manifold() {
            for (let i = 0; i < reso_height - 1; i++) {
                p.beginShape(p.TRIANGLE_STRIP);
                for (let j = 0; j < reso_width + 1; j++) {
                for (let k = 0; k < 2; k++) {
                    let [x, y, z] = point_fin[i + k][j];
                    p.vertex(x, y, z, j / reso_width, 1 - (i + k) / (reso_height - 1));
                }
                }
                p.endShape();
            }
            }

            function draw_projection() {
            let sink = factor();
            let source = -factor();
            for (let i = 0; i < reso_height - 1; i++) {
                p.beginShape(p.TRIANGLE_STRIP);
                for (let j = 0; j < reso_width + 1; j++) {
                for (let k = 0; k < 2; k++) {
                    let [x, y, z] = point_fin[i + k][j];

                    if (x == source) {
                    // Point at infinity
                    // vertex(h, MAX_VALUE, MAX_VALUE, (i + k) / reso_height, j / reso_width);
                    // vertex(h, -MAX_VALUE, MAX_VALUE, (i + k) / reso_height, j / reso_width);
                    // vertex(h, MAX_VALUE, -MAX_VALUE, (i + k) / reso_height, j / reso_width);
                    // vertex(h, -MAX_VALUE, -MAX_VALUE, (i + k) / reso_height, j / reso_width);
                    }
                    else {
                    //Fix Overlapping
                    if (p.dist(
                        x, y, z,
                        source, 0, 0
                    ) <= dist_min * 1.10)
                    //
                    {
                        p.endShape();
                        p.beginShape(p.TRIANGLE_STRIP);
                        continue;
                    }
                    p.stroke(255, 255, 255);
                    p.vertex(
                    sink,
                    y * (sink - source) / (x - source),
                    z * (sink - source) / (x - source),
                    j / reso_width,
                    1 - (i + k) / (reso_height - 1)
                    );
                    }
                }
                }
                p.endShape();
            }
            }

            p.draw = function () {

            kappa = kappa_slider.value() != 0 ? kappa_slider.value() : point.near_zero;
            if (kappa > 0) dist_min = MAX_VALUE;
            else dist_min = 0;

            p.background(0);
            p.scale(100);
            p.rotateY(p.HALF_PI);
            p.translate(factor(), 0, 0);
            p.rotateY(p.PI);

            //slider update
            trans.update();
            reso_height_slider.update();
            reso_width_slider.update();



            if (reso_width_slider.changed || reso_height_slider.changed || kappa_slider.changed) set_vertices();

            for (let i = 0; i < reso_height; i++) {
                for (let j = 0; j < reso_width + 1; j++) {
                point_fin[i][j] = point_init[i][j].operate(
                    trans.point
                ).operate(new point.Point(
                    0,
                    0,
                    -0.25,
                    kappa
                )).project;
                point_fin[i][j] = [
                    point_fin[i][j]._data[0][0],
                    point_fin[i][j]._data[1][0],
                    point_fin[i][j]._data[2][0],
                ]
                let [x, y, z] = point_fin[i][j];
                dist_min = p.min(
                    dist_min, p.dist(
                    x, y, z,
                    - factor(), 0, 0
                    )
                )
                }
            }
            p.strokeWeight(10);
            p.stroke(255, 0, 0);
            p.point(+factor() + 0.01, 0, 0);
            p.point(+factor() - 0.01, 0, 0);

            if (kappa != 0) {
                p.stroke(255, 255, 0);
                p.point(-factor() + 0.01, 0, 0);
                p.point(-factor() - 0.01, 0, 0);
            }

            p.textureMode(p.NORMAL);
            p.texture(image);

            if (model_checkbox.checked()) draw_manifold();

            if (projection_checkbox.checked()) draw_projection();

            p.orbitControl();
            }

        }

        new p5(sketch);
    }
);