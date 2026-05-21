import { describe, it, expect, vi, beforeEach } from "vitest";
import { CONTACT_FALLBACK } from "@/lib/cms/fallbacks/contact";

vi.mock("@/lib/cms/db", () => ({ prisma: { contactInfo: { findUnique: vi.fn() } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { prisma } from "@/lib/cms/db";
import { getContact } from "./contact";

const findUnique = prisma.contactInfo.findUnique as unknown as ReturnType<typeof vi.fn>;

describe("getContact", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns fallback when missing", async () => {
    findUnique.mockResolvedValue(null);
    expect(await getContact()).toEqual(CONTACT_FALLBACK);
  });

  it("returns fallback when the DB throws", async () => {
    findUnique.mockRejectedValue(new Error("db down"));
    expect(await getContact()).toEqual(CONTACT_FALLBACK);
  });

  it("maps a row with children", async () => {
    findUnique.mockResolvedValue({
      id: "singleton",
      phone: "p",
      email: "e",
      addressLine: "a",
      offices: [{ id: "o1", iconName: "Mail", label: "Email", lines: ["x@y.com"], order: 0 }],
      bookingOptions: [],
      socialLinks: [],
    });
    const result = await getContact();
    expect(result.phone).toBe("p");
    expect(result.offices[0].label).toBe("Email");
  });
});
