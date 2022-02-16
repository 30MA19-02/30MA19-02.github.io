import { Matrix } from '../../src/math/matrix';
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe('Matrix', () => {
  describe('constructor data and size', () => {
    it('scalar', () => {
      expect(new Matrix([[0]]).data).toStrictEqual([[0]]);
      expect(new Matrix([[0]]).size).toStrictEqual([1,1]);
    });
    it('square', () => {
      expect(new Matrix([[1,2],[3,4]]).data).toStrictEqual([[1,2],[3,4]]);
      expect(new Matrix([[1,2],[3,4]]).size).toStrictEqual([2,2]);
    });
    it('row', () => {
      expect(new Matrix([[-1],[0],[1]]).data).toStrictEqual([[-1],[0],[1]]);
      expect(new Matrix([[-1],[0],[1]]).size).toStrictEqual([3,1]);
    });
    it('column', () => {
      expect(new Matrix([[-1,0,1]]).data).toStrictEqual([[-1,0,1]]);
      expect(new Matrix([[-1,0,1]]).size).toStrictEqual([1,3]);
    });
    it('rectangle', () => {
      expect(new Matrix([[1,2,3],[4,5,6]]).data).toStrictEqual([[1,2,3],[4,5,6]]);
      expect(new Matrix([[1,2,3],[4,5,6]]).size).toStrictEqual([2,3]);
      expect(new Matrix([[1,2],[3,4],[5,6]]).data).toStrictEqual([[1,2],[3,4],[5,6]]);
      expect(new Matrix([[1,2],[3,4],[5,6]]).size).toStrictEqual([3,2]);
    });
    it('null', () => {
      expect(()=>new Matrix([])).toThrow();
      expect(()=>new Matrix([[]])).toThrow();
    });
    it('not matrix', () => {
      expect(()=>new Matrix([[1,2,3], [1,2]])).toThrow();
      expect(()=>new Matrix([[1,2], [1,2,3]])).toThrow();
    });
  });
  describe('block', () => {
    it('single', () => {
      expect(Matrix.block([[new Matrix([[1]])]]).data).toStrictEqual([[1]]);
    });
    it('row', () => {
      expect(Matrix.block([[new Matrix([[1]]),new Matrix([[2]])]]).data).toStrictEqual([[1,2]]);
      expect(Matrix.block([[new Matrix([[1,2],[5,6]]),new Matrix([[3,4],[7,8]])]]).data).toStrictEqual([[1,2,3,4],[5,6,7,8]]);
    });
    it('column', () => {
      expect(Matrix.block([[new Matrix([[1]])],[new Matrix([[2]])]]).data).toStrictEqual([[1],[2]]);
      expect(Matrix.block([[new Matrix([[1,2],[3,4]])],[new Matrix([[5,6],[7,8]])]]).data).toStrictEqual([[1,2],[3,4],[5,6],[7,8]]);
    });
    it('square', () => {
      expect(Matrix.block([[new Matrix([[1]]), new Matrix([[2]])], [new Matrix([[3]]), new Matrix([[4]])]]).data).toStrictEqual([[1,2],[3,4]]);
      expect(Matrix.block([[new Matrix([[1,2],[5,6]]), new Matrix([[3,4],[7,8]])], [new Matrix([[9,10],[13,14]]), new Matrix([[11,12],[15,16]])]]).data).toStrictEqual([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]);
    });
    it('scalar-row-column', () => {
      expect(Matrix.block([[new Matrix([[1]]), new Matrix([[2,3,4]])],[new Matrix([[5],[9],[13]]),new Matrix([[6,7,8],[10,11,12],[14,15,16]])]]).data).toStrictEqual([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]);
      expect(Matrix.block([[new Matrix([[1,2,3]]), new Matrix([[4]])],[new Matrix([[5,6,7],[9,10,11],[13,14,15]]),new Matrix([[8],[12],[16]])]]).data).toStrictEqual([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]);
    });
    it('null', () => {
      expect(()=>Matrix.block([])).toThrow();
      expect(()=>Matrix.block([[]])).toThrow();
    });
    it('compatible not matrix block', () => {
      expect(()=>Matrix.block([[new Matrix([[1]]), new Matrix([[2]])], [new Matrix([[3,4]])]])).toThrow();
    });
    it('compatible not aligned block', () => {
      // expect(()=>Matrix.block([[new Matrix([[1,2],[5,6]]), new Matrix([[3,4],[7,8]])], [new Matrix([[9,10,11],[13,14,15]]), new Matrix([[12],[16]])]])).toThrow();
      expect(()=>Matrix.block([[new Matrix([[1,2],[5,6], [9,10]]), new Matrix([[3,4],[7,8]])], [new Matrix([[13,14]]), new Matrix([[11,12],[15,16]])]])).toThrow();
    });
    it('incompatible', () => {
      expect(()=>Matrix.block([[new Matrix([[1,2],[3,4]])],[new Matrix([[5],[6]])]])).toThrow();
      expect(()=>Matrix.block([[new Matrix([[1,2],[5,6]]), new Matrix([[3,4]])]])).toThrow();
    });
  });
  describe('add', () => {
    it('compatible', () => {
      expect(new Matrix([[1]]).add(new Matrix([[2]])).data).toStrictEqual([[3]]);
      expect(new Matrix([[1,3]]).add(new Matrix([[2,4]])).data).toStrictEqual([[3,7]]);
      expect(new Matrix([[1],[3]]).add(new Matrix([[2],[4]])).data).toStrictEqual([[3],[7]]);
      expect(new Matrix([[1,3],[5,7]]).add(new Matrix([[2,4],[6,8]])).data).toStrictEqual([[3,7],[11,15]]);
    });
    it('incompatible', () => {
      expect(()=>new Matrix([[1]]).add(new Matrix([[2,3]]))).toThrow();
      expect(()=>new Matrix([[1]]).add(new Matrix([[2],[3]]))).toThrow();
      expect(()=>new Matrix([[1,3]]).add(new Matrix([[2],[4]]))).toThrow();
    });
  });
});
