let geom_shader;
let geom = new Geometry();
function preload(){
  geom_shader = loadShader("shader/hyperbolic.vert", "shader/basic.frag");
}
function setup() {
  createCanvas(500, 500, WEBGL);
  
}


function draw() {
  shader(geom_shader);
  orbitControl();
  background(0);
  geom_shader.setUniform('u_transformation', geom.transformation.value.flat());
  geom_shader.setUniform('u_t', frameCount);
  strokeWeight(10);
  stroke(255);
  fill(0);
  for(let i=-width/2; i<width/2; i+=width/10){
    for(let j=-height/2; j<height/2; j+=height/10){
      quad(
            i-5,j-5,
            i+5,j-5,
            i+5,j+5,
            i-5,j+5
        );
    }
  }
  geom.translate(.01*deltaTime/1000);
}
function mouseClicked(){
    // noLoop();
}

