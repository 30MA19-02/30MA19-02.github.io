import { Point } from "..";
// Change attributes / method or others such that it is easy for you to use
// The test must test the indicated property of the class
// It will be used to do test-driven development for user-friendly interface later
describe("Point", () => {
  describe("Construction", () => {
    it("No parameters", () => {
      const t = () => new Point();
      expect(t).toThrow(Error);
      expect(t).toThrow("Curvature parameter expected.");
    });
    describe("Curvature only", () => {
      it("Positive Curvature (+1)", () => {
        const p = new Point(+1);
        expect(p.mat).toBe(undefined);
        expect(p.kappa).toBe(+1);
      });
      it("Positive Curvature (+2)", () => {
        const p = new Point(+2);
        expect(p.mat).toBe(undefined);
        expect(p.kappa).toBe(+2);
      });
      it("Negative Curvature (-1)", () => {
        const p = new Point(-1);
        expect(p.mat).toBe(undefined);
        expect(p.kappa).toBe(-1);
      });
      it("Negative Curvature (-2)", () => {
        const p = new Point(-2);
        expect(p.mat).toBe(undefined);
        expect(p.kappa).toBe(-2);
      });
      it("No Curvature (0)", () => {
        const p = new Point(0);
        expect(p.mat).toBe(undefined);
        expect(p.kappa).toBe(0);
      });
      it("Not a number", () => {
        const t = () => new Point(NaN);
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a finite number.");
      });
      it("Infinite", () => {
        const t = () => new Point(Infinity);
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a finite number.");
      });
      it("Invalid types (boolean)", () => {
        const t = () => new Point(true);
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a number.");
      });
      it("Invalid types (null)", () => {
        const t = () => new Point(null);
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a number.");
      });
      it("Invalid types (undefined)", () => {
        const t = () => new Point(undefined);
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a number.");
      });
      it("Invalid types (string)", () => {
        const t = () => new Point("");
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a number.");
      });
      it("Invalid types (object)", () => {
        const t = () => new Point({});
        expect(t).toThrow(Error);
        expect(t).toThrow("Curvature parameter must be a number.");
      });
    });
    // Test that it is successfully constructed
    // Test what happened when parameter length changes (include cases of disagreement: too many theta, too many phi, phi not ordered, etc.)
    // Include Orientation only case
    // Include garbage arguments cases too
    it.todo("Position only");
    it.todo("With orientation");
  });

  // Test with each valid construction (Curvature only, Position only, and With orientation) then check the value
  // undefined is expected from Curvature only constructor
  it.todo("Dimension acquicision");

  // Test with each valid construction scheme
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the projection
  // Check if the result is in the locus (sphere with radius 1/kappa, plane, hyperboloid with radius 1/kappa)
  it.todo("Projection");

  // Test with each valid construction (Curvature only, Position only, and With orientation)
  // undefined is expected from Curvature only constructor
  // Including orientation dont change the mapping
  // Result must match the position
  // Matrix (or projection) constructed by the inverse must be the same
  it.todo("Inverse mapping");

  // The idea of matrix exponentiation is quite interesting
  // May implement this to do something like a smooth differential path for operations
  // Not sure yet but seems valid.
  // If it is pure theta and along axis should be linearly spaced as the exponent is linearly exponent
  // The method may then return the point with such scale argument
  // May operate such that theta and phi is aligned with the axis first then operate back (as the pure axis-aligned transformation are definitely additive)

  // Test with each valid construction (Curvature only, Position only, and With orientation)
  // - Pure theta in each axis is additive (range considered)
  // - Pure phi in each axis is additive (range considered)
  // The condition should probably be in the proof private repository (my require some calculus work precalculated or just calculated)
  // - Operation is distance preserved 
  // - Operation is smooth
  // - Sectional curvature is kappa
  it.todo("Operation");

  // Any other test that may be use full may be describe here.

});
