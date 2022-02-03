import {sin, sinh, cos, cosh, matrix, multiply, concat, identity, zeros} from 'mathjs';

function sine(theta, kappa = 1, s = false) {
  return kappa == 0 ? (s ? 0 : theta) : kappa > 0 ? sin(theta * kappa) : (s ? -sinh(theta * kappa) : sinh(theta * kappa));
}
function cosine(theta, kappa = 1) {
  return kappa == 0 ? 1 : kappa > 0 ? cos(theta * kappa) : cosh(theta * kappa);
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
      matrix(new Array(n+1).fill(0).map(
        (_, i)=>new Array(n+1).fill(0).map((_,j)=>
          (i==j && i!=1 && i!= n) || (i==1&&j==n) || (i==n&&j==1)? 1:0
        ))),
      multiply(
        (n==1? rotation(theta[n-1], kappa):concat(concat(rotation(theta[n-1], kappa), zeros(n-1,2), 0), concat(zeros(2,n-1), identity(n-1), 0), 1)),
        matrix(new Array(n+1).fill(0).map(
          (_, i)=>new Array(n+1).fill(0).map((_,j)=>
            (i==j && i!=1 && i!= n) || (i==1&&j==n) || (i==n&&j==1)? 1:0
          ))
        )
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
  return multiply(orientational(...phi), positional(kappa, ...theta))
}

export class Point {
  constructor(kappa, theta, ...phi) {
    this.kappa = kappa;
    if(phi.length!=0) this.mat = point(kappa, theta, ...phi, []);
    else if(theta===undefined) this.mat = undefined;
    else this.mat = positional(kappa, ...theta);
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
  operate(other) {
    console.assert(this.dim == other.dim, "Invalid point: This point (" + this.dim.toString() + ") is not in the same dimension with the other (" + other.dim.toString() + ").")
    console.assert(this.kappa == other.kappa, "Invalid point: This point (" + this.kappa.toString() + ") is not in the same curvature with the other (" + other.kappa.toString() + ").")
    let p = new Point(this.kappa);
    p.mat = multiply(
      other.mat,
      this.mat,
    );
    return p;
  }
}
