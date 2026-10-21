import { z } from "zod";
import { normalizeName } from "./normalization";

export const nameSchema = z.string().trim().min(2, "Masukkan nama lengkap Anda.").max(120, "Nama maksimal 120 karakter.");
export const memberSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  member_number: z.string().trim().max(60).optional().nullable()
});

export function validatedName(value: unknown) {
  const name = nameSchema.parse(value);
  return { fullName: name.replace(/\s+/g, " "), normalizedName: normalizeName(name) };
}
