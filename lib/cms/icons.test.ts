import { describe, it, expect } from "vitest";
import { resolveIcon, ICON_NAMES } from "./icons";

describe("icons", () => {
  it("resolves a known icon to a component", () => {
    expect(resolveIcon("Stamp")).toBeTruthy();
    expect(["object", "function"]).toContain(typeof resolveIcon("Stamp"));
  });

  it("falls back for an unknown icon", () => {
    expect(resolveIcon("NotARealIcon")).toBe(resolveIcon("__fallback__"));
  });

  it("exposes the allowlist", () => {
    expect(ICON_NAMES).toContain("Stamp");
    expect(ICON_NAMES).toContain("MapleLeaf");
  });
});
