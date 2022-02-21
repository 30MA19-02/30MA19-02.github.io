import { Matrix } from 'mathjs';
import * as point from './functional';

import config from './config';

export class Point implements point.publicPoint{
  public dim: number;
  public readonly kappa: number;
  private _mat!: Matrix;
  constructor(publicObj: point.publicPoint);
  constructor(privateObj: point.privatePoint);
  constructor(dim: number, kappa: number);
  constructor(dim: number, kappa: number, theta: number[]);
  constructor(dim: number, kappa: number, ...phi: number[][]);
  constructor(dim: number, kappa: number, reflect: boolean);
  constructor(dim: number, kappa: number, theta: number[], ...phi: number[][]);
  constructor(dim: number, kappa: number, reflect: boolean, theta: number[]);
  constructor(dim: number, kappa: number, reflect: boolean, ...phi: number[][]);
  constructor(dim: number, kappa: number, reflect: boolean, theta: number[], ...phi: number[][]);
  constructor(val: number|point.publicPoint|point.privatePoint, kappa?: number, ...arr: (number[] | boolean)[]) {
    if(typeof val !== 'number'){
      if('matrix' in val){
        this.dim = val.dim;
        this.kappa = val.kappa;
        this.matrix = val.matrix;
        return;
      }
      kappa = val.kappa;
      val = val.dim;
    }
    const object = point.point(val, kappa!, ...arr);
    this.dim = object.dim;
    this.kappa = object.kappa;
    this.matrix = object.matrix;
  }

  protected get privateObject(): point.privatePoint{
    return {dim: this.dim, kappa: this.kappa, matrix: this.matrix};
  }

  protected set matrix(value: Matrix) {
    if(config.strict){
      point.isValid(this.privateObject);
    }
    this._mat = value;
  }
  public get matrix(): Matrix {
    return this._mat;
  }

  public get project(): Matrix {
    return point.project(this.privateObject);
  }

  public get theta(): number[] {
    return point.theta(this.privateObject);
  }

  public operate(other: Point): Point {
    return new Point(point.operate(this.privateObject, other.privateObject));
  }
}
