import { Point } from "..";
describe("Point", () => {
  describe("Construction", () => {
    it("No parameters", () => {
      const t = () => new Point();
      expect(t).toThrow(Error);
      expect(t).toThrow("Curvature parameter expected.");
    });
    describe("Curvature only", () => {
      it("Positive Curvature (+1)", () => {
        expect(new Point(+1).mat).toBe(undefined);
      });
      it("Positive Curvature (+2)", () => {
        expect(new Point(+2).mat).toBe(undefined);
      });
      it("Negative Curvature (-1)", () => {
        expect(new Point(-1).mat).toBe(undefined);
      });
      it("Negative Curvature (-2)", () => {
        expect(new Point(-2).mat).toBe(undefined);
      });
      it("No Curvature (0)", () => {
        expect(new Point(0).mat).toBe(undefined);
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
    describe("Position only", () => {
      describe("Positive Curvature (+1)", () => {
        describe("2 dimensional", () => {
          it.todo("Along 1st axis");
          it.todo("Along 2nd axis");
          it.todo("Along both axes");
        });
        describe("high dimensional", () => {
          it.todo("Along axis");
          it.todo("Along axes");
        });
      });
      describe("Positive Curvature (+2)", () => {
        describe("2 dimensional", () => {
          it.todo("Along 1st axis");
          it.todo("Along 2nd axis");
          it.todo("Along both axes");
        });
        describe("high dimensional", () => {
          it.todo("Along axis");
          it.todo("Along axes");
        });
      });
      describe("Negative Curvature (+1)", () => {
        describe("2 dimensional", () => {
          it.todo("Along 1st axis");
          it.todo("Along 2nd axis");
          it.todo("Along both axes");
        });
        describe("high dimensional", () => {
          it.todo("Along axis");
          it.todo("Along axes");
        });
      });
      describe("Negative Curvature (+2)", () => {
        describe("2 dimensional", () => {
          it.todo("Along 1st axis");
          it.todo("Along 2nd axis");
          it.todo("Along both axes");
        });
        describe("high dimensional", () => {
          it.todo("Along axis");
          it.todo("Along axes");
        });
      });
      describe("No Curvature (0)", () => {
        describe("2 dimensional", () => {
          it.todo("Along 1st axis");
          it.todo("Along 2nd axis");
          it.todo("Along both axes");
        });
        describe("high dimensional", () => {
          it.todo("Along axis");
          it.todo("Along axes");
        });
      });
    });
    it.todo("With orientation only");
  });

  it.todo("Dimension acquicision");

  it.todo("Projection");

  it.todo("Inverse mapping");

  it.todo("Operation");
});
