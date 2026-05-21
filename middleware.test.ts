import { describe, it, expect } from "vitest";
import { isProtected } from "./middleware";

describe("isProtected", () => {
  it("protects /admin and subpaths", () => {
    expect(isProtected("/admin")).toBe(true);
    expect(isProtected("/admin/hero")).toBe(true);
  });

  it("does not protect the login page or public site", () => {
    expect(isProtected("/admin/login")).toBe(false);
    expect(isProtected("/")).toBe(false);
    expect(isProtected("/blog")).toBe(false);
  });
});
