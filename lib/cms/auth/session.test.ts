import { describe, it, expect, beforeAll } from "vitest";
import { signSession, verifySessionToken } from "./session";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-test-secret-test-secret";
});

describe("session token", () => {
  it("round-trips a valid token", async () => {
    const token = await signSession({ sub: "user-1", email: "a@b.com" });
    const payload = await verifySessionToken(token);
    expect(payload?.email).toBe("a@b.com");
    expect(payload?.sub).toBe("user-1");
  });

  it("returns null for a tampered token", async () => {
    expect(await verifySessionToken("garbage.token.here")).toBeNull();
  });
});
