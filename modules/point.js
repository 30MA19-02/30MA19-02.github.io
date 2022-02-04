import {sin, sinh, asin, asinh, cos, cosh, acos, acosh, matrix, multiply, concat, identity, zeros, pi} from 'mathjs';

function sine(theta, kappa = 1, s = false) {
  return kappa == 0 ? (s ? 0 : theta) : kappa > 0 ? sin(theta * kappa) : (s ? -sinh(theta * kappa) : sinh(theta * kappa));
}
function cosine(theta, kappa = 1) {
  return kappa == 0 ? 1 : kappa > 0 ? cos(theta * kappa) : cosh(theta * kappa);
}

function arcsine(x, kappa = 1, s = false) {
  return kappa == 0 ? (s ? 0 : x) : kappa > 0 ? asin(x)/kappa : (s ? asinh(-x)/kappa: asinh(x)/kappa);
}
function arccosine(x, kappa = 1) {
  return kappa == 0 ? 0 : kappa > 0 ? cos(x)/kappa : cosh(x)/kappa;
}

function rotation(theta, kappa){
  return matrix([
    [cosine(theta, kappa), -sine(theta, kappa, true)],
    [sine(theta, kappa), cosine(theta, kappa)],
  ]);
}

function positional(kappa, ...theta){
  let n = theta.length;

  if(n==0) return matrix([[1]]);
  return multiply(
    concat(concat(positional(kappa, ...theta.slice(0,-1)), zeros(1,n), 0), concat(zeros(n,1), identity(1), 0), 1),
    multiply(
      identity(n+1).swapRows(1, n),
      multiply(
        (n==1? rotation(theta[n-1], kappa):concat(concat(rotation(theta[n-1], kappa), zeros(n-1,2), 0), concat(zeros(2,n-1), identity(n-1), 0), 1)),
        identity(n+1).swapRows(1, n)
      )
    )
  );
}
function orientational(...phi){
  let n = phi.length;
  let reflect = false;
  if(n==0)return multiply(identity(1),reflect? -1:1);
  return concat(concat(identity(1), zeros(n,1), 0), concat(zeros(1,n), point(+1, ...phi), 0), 1);
}
function point(kappa, theta, ...phi){
  return multiply(positional(kappa, ...theta), orientational(...phi))
}

export class Point {
  constructor(kappa, theta, ...phi) {
    this.kappa = kappa;
    if(phi.length!=0) this.mat = point(kappa, theta, ...phi, []);
    else if(!(theta===undefined)) this.mat = positional(kappa, ...theta);
    else this.mat = undefined;
  }
  get dim() {
    return this.mat.size()[0] - 1;
  }
  get project() {
    return multiply(
      multiply(
        this.mat,
        concat(identity(1), zeros(this.dim, 1), 0),
      ),
      this.kappa != 0 ? 1 / this.kappa : 1
    );
  }
  get theta() {
    let pr_ = multiply(this.project, this.kappa != 0 ? this.kappa : 1);
    let pr = new Array(this.dim+1).fill(0).map((_, i) => 
      pr_.get([i,0])
    );
    let theta = pr.slice().reverse();
    let p = theta.pop();
    for(let i=0; i<theta.length;){
      theta[i] = arcsine(theta[i], this.kappa);
      for(let j=++i; j<theta.length; j++){
        theta[j] /= cosine(theta[i-1], this.kappa);
      }
    }
    theta = theta.reverse();
    if(this.kappa > 0 && p<0){
      theta[0] *= -1;
      if (theta[0] > 0){
        theta[0] -= pi/this.kappa;
      }else{
        theta[0] += pi/this.kappa;
      }
    }
    return theta;
  }
  operate(other) {
    console.assert(this.dim == other.dim, "Invalid point: This point (" + this.dim.toString() + ") is not in the same dimension with the other (" + other.dim.toString() + ").")
    console.assert(this.kappa == other.kappa, "Invalid point: This point (" + this.kappa.toString() + ") is not in the same curvature with the other (" + other.kappa.toString() + ").")
    let p = new this.constructor(this.kappa);
    p.mat = multiply(
      other.mat,
      this.mat,
    );
    return p;
  }
}
