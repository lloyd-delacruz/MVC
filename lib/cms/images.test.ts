import { describe, it, expect } from "vitest";
import { validateImageFile } from "./images";

function fakeFile(type: string, size: number): File {
  return { type, size, name: "x" } as unknown as File;
}

describe("validateImageFile", () => {
  it("accepts a small jpeg", () => {
    expect(validateImageFile(fakeFile("image/jpeg", 1024)).ok).toBe(true);
  });

  it("rejects a non-image", () => {
    expect(validateImageFile(fakeFile("application/pdf", 1024)).ok).toBe(false);
  });

  it("rejects an oversized image", () => {
    expect(validateImageFile(fakeFile("image/png", 6 * 1024 * 1024)).ok).toBe(false);
  });
});
