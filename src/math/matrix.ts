import { abs } from 'mathjs';

const assert = (condition: boolean, message?: string) => {
  if (!condition) throw new Error(message);
};
export class Matrix {
  public readonly data: number[][];
  constructor(data: number[][]) {
    // O(n**2)
    assert(
      data.length > 0 && data.every((row) => row.length > 0 && data[0].length === row.length),
      'Not a valid matrix',
    );
    this.data = data;
  }
  static zeros(m: number, n: number) {
    return new Matrix(new Array(m).fill(new Array(n).fill(0)));
  }
  static identity(n: number) {
    return new Matrix(new Array(n).fill(0).map((_, i) => new Array(n).fill(0).map((_, j) => (i === j ? 1 : 0))));
  }
  static diagonal(diag: number[]) {
    return new Matrix(new Array(diag.length).fill(0).map((_, i) => new Array(diag.length).fill(0).map((_, j) => (i === j ? diag[i] : 0))));
  }
  static permutation(perm: number[]) {
    return new Matrix(new Array(perm.length).fill(0).map((_, i) => new Array(perm.length).fill(0).map((_, j) => (perm[i] === j ? 1 : 0))));
  }
  static block(sub: Matrix[][]) {
    assert(
      sub.every((row) => sub[0].length === row.length),
      'Not a valid block',
    );
    return new Matrix(
      sub.reduce(
        (rows: number[][], row: Matrix[]) =>
          rows.concat(
            row.reduce(
              (cols: number[][], block: Matrix) => {
                assert(cols.length === block.size[0]);
                return cols.map((col, i) => col.concat(block.data[i]));
              },
              new Array(row[0].size[0]).fill(0).map((_) => new Array()),
            ),
          ),
        [],
      ),
    );
  }
  public get size(): number[] {
    // O(1)
    return [this.data.length, this.data[0].length];
  }
  public get transpose(): Matrix {
    // O(n**2)
    return new Matrix(
      new Array(this.size[1]).fill(0).map((_, i) => new Array(this.size[0]).fill(0).map((_, j) => this.data[j][i])),
    );
  }
  public get square(): boolean {
    // O(1)
    return this.size[0] === this.size[1];
  }
  public get rref(): Matrix {
    // O(mn**2)
    let matrix = this.data;
    let h = 0;
    let k = 0;
    while (h < this.size[0] && k < this.size[1]) {
      let i_max = matrix.reduce((stat, row, i) => (abs(row[k]) > stat.max ? { max: abs(row[k]), ind: i } : stat), {
        max: 0,
        ind: -1,
      }).ind;
      if (matrix[i_max][k] !== 0) {
        matrix[h], (matrix[i_max] = matrix[i_max]), matrix[h];
        for (let i = h + 1; i < this.size[0]; i++) {
          let f = matrix[i][k] / matrix[h][k];
          matrix[i][k] = 0;
          for (let j = k + 1; j < this.size[1]; j++) {
            matrix[i][j] -= matrix[h][j] * f;
          }
        }
        h++;
      }
      k++;
    }
    return new Matrix(matrix);
  }
  public get inv(): Matrix {
    assert(this.determinant !== 0);
    return new Matrix(
      Matrix.block([[this, Matrix.identity(this.size[0])]]).rref.data.map((row) => row.slice(this.size[0])),
    );
  }
  public get determinant(): number {
    // O(n**3)
    assert(this.size[0] === this.size[1]);
    const dim = this.size[0];
    let matrix = this.data;
    let factor = 1;
    for(let k=0; k<dim; k++){
        for(let i=k+1; i<dim; i++){
            for(let j=k+1; j<dim; j++){
                matrix[i][j] = (matrix[i][j]*matrix[k][k]-matrix[i][k]*matrix[k][j]);
                if(k===0) continue;
                matrix[i][j]/=matrix[k-1][k-1];
            }
        }
        if(matrix[k][k]===0){
            factor *= -1;
            let ind = matrix[k].find((val, ind)=>ind>k&&val!==0);
            assert(ind === undefined);
            matrix[k], matrix[ind!] = matrix[ind!], matrix[k];
        }
    }
    return matrix[dim-1][dim-1];
  }
  public add(other: Matrix) {
    // O(n**2)
    assert(
      this.size[0] === other.size[0] && this.size[1] === other.size[1],
      `Incompatible dimension ${this.size} and ${other.size}`,
    );
    return new Matrix(this.data.map((row, i) => row.map((a, j) => a + other.data[i][j])));
  }
  public multiplyScalar(other: number) {
    // O(n**2)
    return new Matrix(this.data.map((row, i) => row.map((a, j) => a * other)));
  }
  public subtract(other: Matrix) {
    // O(n**2)
    assert(
      this.size[0] === other.size[0] && this.size[1] === other.size[1],
      `Incompatible dimension ${this.size} and ${other.size}`,
    );
    return new Matrix(this.data.map((row, i) => row.map((a, j) => a - other.data[i][j])));
  }
  private definition_multiply(other: Matrix) {
    // O(nmp)
    const other_ = other.transpose;
    return new Matrix(this.data.map((a_) => other_.data.map((b) => a_.reduce((p, a, k) => p + a * b[k], 0))));
  }
  private strassen_multiply(other: Matrix): Matrix {
    // O(n**2.807)
    let dim = this.size[0];
    if (dim === 1) return new Matrix([[this.data[0][0] * other.data[0][0]]]);
    if (dim % 2 === 1)
      return new Matrix(
        Matrix.block([
          [Matrix.zeros(1, 1), Matrix.zeros(1, dim)],
          [Matrix.zeros(dim, 1), this],
        ])
          .multiply(
            Matrix.block([
              [Matrix.zeros(1, 1), Matrix.zeros(1, dim)],
              [Matrix.zeros(dim, 1), other],
            ]),
          )
          .data.slice(1)
          .map((row) => row.slice(1)),
      );
    dim = (dim / 2) >> 0;
    const A = [
      [
        new Matrix(new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => this.data[i][j]))),
        new Matrix(new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => this.data[i][dim + j]))),
      ],
      [
        new Matrix(new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => this.data[dim + i][j]))),
        new Matrix(
          new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => this.data[dim + i][dim + j])),
        ),
      ],
    ];
    const B = [
      [
        new Matrix(new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => other.data[i][j]))),
        new Matrix(new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => other.data[i][dim + j]))),
      ],
      [
        new Matrix(new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => other.data[dim + i][j]))),
        new Matrix(
          new Array(dim).fill(0).map((_, i) => new Array(dim).fill(0).map((_, j) => other.data[dim + i][dim + j])),
        ),
      ],
    ];
    const M = [
      A[0][0].add(A[1][1]).multiply(B[0][0].add(B[1][1])),
      A[1][0].add(A[1][1]).multiply(B[0][0]),
      A[0][0].multiply(B[0][1].subtract(B[1][1])),
      A[1][1].multiply(B[1][0].subtract(B[0][0])),
      A[0][0].add(A[0][1]).multiply(B[1][1]),
      A[1][0].subtract(A[0][0]).multiply(B[0][0].add(B[0][1])),
      A[0][1].subtract(A[1][1]).multiply(B[1][0].add(B[1][1])),
    ];
    return Matrix.block([
      [M[0].add(M[3]).subtract(M[4]).add(M[6]), M[2].add(M[4])],
      [M[1].add(M[3]), M[0].subtract(M[1]).add(M[2]).add(M[5])],
    ]);
  }
  public multiply(other: Matrix) {
    assert(this.size[1] === other.size[0]);
    return this.square && other.square ? this.strassen_multiply(other) : this.definition_multiply(other);
  }
  public sliceRow(start?: number,end?:number){
    return new Matrix(this.data.slice(start, end));
  }
  public sliceCol(start?: number,end?:number){
    return new Matrix(this.data.map(_=>_.slice(start, end)));
  }
}
