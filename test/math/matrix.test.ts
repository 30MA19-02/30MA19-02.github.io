import { Matrix } from '../../src/math/matrix';
import '../extension';

describe('Math module > Matrix: Validity test', () => {
  it('block', () => {
    expect(
      Matrix.block(
        new Matrix([
          [1, 2],
          [3, 4],
        ]),
        new Matrix([
          [5, 6],
          [7, 8],
        ]),
        new Matrix([]),
        new Matrix([]),
      ),
    ).toBeStrictlyEqual([
      [1, 2, 5, 6],
      [3, 4, 7, 8],
    ]);
    expect(
      Matrix.block(
        new Matrix([]),
        new Matrix([]),
        new Matrix([
          [1, 2],
          [3, 4],
        ]),
        new Matrix([
          [5, 6],
          [7, 8],
        ]),
      ),
    ).toBeStrictlyEqual([
      [1, 2, 5, 6],
      [3, 4, 7, 8],
    ]);
    expect(
      Matrix.block(
        new Matrix([
          [1, 2],
          [3, 4],
        ]),
        new Matrix([]),
        new Matrix([
          [5, 6],
          [7, 8],
        ]),
        new Matrix([]),
      ),
    ).toBeStrictlyEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
    expect(
      Matrix.block(
        new Matrix([]),
        new Matrix([
          [1, 2],
          [3, 4],
        ]),
        new Matrix([]),
        new Matrix([
          [5, 6],
          [7, 8],
        ]),
      ),
    ).toBeStrictlyEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
    ]);
    expect(
      Matrix.block(
        new Matrix([
          [1, 2],
          [4, 5],
        ]),
        new Matrix([[3], [6]]),
        new Matrix([[7, 8]]),
        new Matrix([[9]]),
      ),
    ).toBeStrictlyEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);
  });
  describe('det', () => {
    it('should calculate correctly the determinant of a square matrix', () => {
      expect(new Matrix([[5]]).det).toBeEqual(5);
      expect(
        new Matrix([
          [1, 2],
          [3, 4],
        ]).det,
      ).toBeEqual(-2);
      expect(
        new Matrix([
          [-2, 2, 3],
          [-1, 1, 3],
          [2, 0, -1],
        ]).det,
      ).toBeEqual(6);
      expect(
        new Matrix([
          [1, 4, 7],
          [3, 0, 5],
          [-1, 9, 11],
        ]).det,
      ).toBeEqual(-8);
      expect(
        new Matrix([
          [1, 7, 4, 3, 7],
          [0, 7, 0, 3, 7],
          [0, 7, 4, 3, 0],
          [1, 7, 5, 9, 7],
          [2, 7, 4, 3, 7],
        ]).det,
      ).toBeEqual(-1176);
      expect(
        new Matrix([
          [0, 7, 0, 3, 7],
          [1, 7, 4, 3, 7],
          [0, 7, 4, 3, 0],
          [1, 7, 5, 9, 7],
          [2, 7, 4, 3, 7],
        ]).det,
      ).toBeEqual(1176);
      expect(
        new Matrix([
          [1, 7, 4, 3, 7],
          [0, 7, 0, 3, 7],
          [0, 7, 4, 3, 0],
          [1, 7, 5, 9, 7],
          [2, 7, 4, 3, 7],
        ]).det,
      ).toBeEqual(-1176);
      expect(Matrix.diag([4, -5, 6]).det).toBeEqual(-120);
    });
    it('should return 1 for the identity matrix', () => {
      expect(Matrix.identity(7).det).toBeEqual(1);
      expect(Matrix.identity(2).det).toBeEqual(1);
      expect(Matrix.identity(1).det).toBeEqual(1);
    });
    it('should return 0 for a singular matrix', () => {
      expect(
        new Matrix([
          [1, 0],
          [0, 0],
        ]).det,
      ).toBeEqual(0);
      expect(
        new Matrix([
          [1, 0],
          [1, 0],
        ]).det,
      ).toBeEqual(0);
      expect(
        new Matrix([
          [2, 6],
          [1, 3],
        ]).det,
      ).toBeEqual(0);
      expect(
        new Matrix([
          [1, 0, 0],
          [0, 0, 0],
          [1, 0, 0],
        ]).det,
      ).toBeEqual(0);
    });
    it('should not change the value of the initial matrix', () => {
      const m = new Matrix([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ]);
      m.det;
      expect(m).toBeStrictlyEqual(
        new Matrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ]),
      );
    });
    it('should not accept a non-square matrix', () => {
      expect(() => {
        new Matrix([[1, 2]]).det;
      }).toThrow();
      expect(() => {
        new Matrix([
          [1, 2, 3],
          [1, 2, 3],
        ]).det;
      }).toThrow();
      expect(() => {
        new Matrix([
          [0, 1],
          [0, 1],
          [0, 1],
        ]).det;
      }).toThrow();
    });
  });
  describe('diag', () => {
    it('should return a diagonal matrix on the default diagonal', () => {
      expect(Matrix.diag([1, 2, 3])).toBeStrictlyEqual([
        [1, 0, 0],
        [0, 2, 0],
        [0, 0, 3],
      ]);
    });
  });
  describe('identity', () => {
    it('should create an identity matrix of the given size', function () {
      expect(Matrix.identity(0)).toBeStrictlyEqual([]);
      expect(Matrix.identity(1)).toBeStrictlyEqual([[1]]);
      expect(Matrix.identity(2)).toBeStrictlyEqual([
        [1, 0],
        [0, 1],
      ]);
      expect(Matrix.identity(3)).toBeStrictlyEqual([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ]);
    });
  });
  describe('mul', () => {
    it('should throw an error when multiplying matrices with incompatible sizes', () => {
      expect(() => new Matrix([[1, 1]]).mul(new Matrix([[1, 1]]))).toThrow();
      expect(() =>
        new Matrix([[1, 1]]).mul(
          new Matrix([
            [1, 1],
            [1, 1],
            [1, 1],
          ]),
        ),
      ).toThrow();
    });
    it('should multiply matrix x matrix with zeros', function () {
      expect(
        new Matrix([
          [2, 0],
          [4, 0],
        ]).mul(
          new Matrix([
            [2, 0],
            [4, 0],
          ]),
        ),
      ).toBeStrictlyEqual([
        [4, 0],
        [8, 0],
      ]);
    });
    it('should multiply triangular matrices', function () {
      expect(
        new Matrix([
          [1, 0, 0, 0],
          [-0.5, 1, 0, 0],
          [0, -0.7, 1, 0],
          [0.0666667, -0.4, -0.5714286, 1],
        ]).mul(
          new Matrix([
            [240, -2700, 6480, -4200],
            [0, -150, 540, -420],
            [0, 0, -42, 56],
            [0, 0, 0, 4],
          ]),
        ),
      ).toBeStrictlyEqual([
        [240, -2700, 6480, -4200],
        [-120, 1200, -2700, 1680],
        [0, 105, -420, 350],
        [16, -120, 240, -140],
      ]);
    });
    it('should multiply matrix x matrix', function () {
      expect(
        new Matrix([
          [1, 2],
          [3, 4],
        ]).mul(
          new Matrix([
            [5, 6],
            [7, 8],
          ]),
        ),
      ).toBeStrictlyEqual([
        [19, 22],
        [43, 50],
      ]);
    });
  });
  describe('transpose', () => {
    it('should transpose a matrix', function () {
      expect(
        new Matrix([
          [1, 2, 3],
          [4, 5, 6],
        ]).transpose,
      ).toBeStrictlyEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
      expect(
        new Matrix([
          [1, 2, 3],
          [4, 5, 6],
        ]).transpose,
      ).toBeStrictlyEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
      expect(
        new Matrix([
          [1, 2],
          [3, 4],
        ]).transpose,
      ).toBeStrictlyEqual([
        [1, 3],
        [2, 4],
      ]);
      expect(new Matrix([[1, 2, 3, 4]]).transpose).toBeStrictlyEqual([[1], [2], [3], [4]]);
    });
  });
  describe('zeros', () => {
    it('should create a matrix of the given size with zeros', function () {
      expect(Matrix.zeros(2, 3)).toBeStrictlyEqual([
        [0, 0, 0],
        [0, 0, 0],
      ]);
      expect(Matrix.zeros(3, 2)).toBeStrictlyEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });
  });
});
