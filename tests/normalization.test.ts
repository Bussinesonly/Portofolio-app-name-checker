import { describe, expect, it } from "vitest";
import { normalizeName } from "@/lib/normalization";
import { nameSchema } from "@/lib/validation";
import { memberSchema } from "@/lib/validation";

describe("normalisasi nama", () => {
  it("mengabaikan kapital dan spasi berlebih", () => expect(normalizeName("  TaRA   Angkasa  ")).toBe("tara angkasa"));
  it("menolak input kosong", () => expect(() => nameSchema.parse("   ")).toThrow());
  it("menerima nama lengkap", () => expect(nameSchema.parse("Arunika Lestari")).toBe("Arunika Lestari"));
  it("menolak baris impor tanpa nama", () => expect(() => memberSchema.parse({ full_name: "", member_number: "D-1" })).toThrow());
});
