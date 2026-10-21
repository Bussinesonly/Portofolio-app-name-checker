import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { ZodError } from "zod";
import { assertAdmin } from "@/lib/admin-auth";
import { memberSchema } from "@/lib/validation";
import { normalizeName } from "@/lib/normalization";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
type Row = { full_name: string; member_number: string | null; normalized_name: string };

function readRows(file: File, nameColumn: string, numberColumn?: string) {
  if (!/\.(xlsx|xls)$/i.test(file.name)) throw new Error("Gunakan file Excel .xlsx atau .xls.");
  if (file.size === 0) throw new Error("File Excel kosong.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran file maksimal 5 MB.");
  return file.arrayBuffer().then((buffer) => {
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!sheet) throw new Error("File tidak berisi lembar data.");
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
    if (!rawRows.length) throw new Error("Tidak ada baris data pada file Excel.");
    const seen = new Set<string>(); const valid: Row[] = []; let invalid = 0; let duplicates = 0;
    for (const raw of rawRows) {
      try {
        const parsed = memberSchema.parse({ full_name: String(raw[nameColumn] ?? ""), member_number: numberColumn ? String(raw[numberColumn] ?? "") : null });
        const memberNumber = parsed.member_number?.trim() || null;
        const normalizedName = normalizeName(parsed.full_name);
        const key = memberNumber ? `number:${memberNumber}` : `name:${normalizedName}`;
        if (seen.has(key)) { duplicates++; continue; }
        seen.add(key); valid.push({ full_name: parsed.full_name.replace(/\s+/g, " "), member_number: memberNumber, normalized_name: normalizedName });
      } catch { invalid++; }
    }
    return { valid, invalid, duplicates, total: rawRows.length };
  });
}

export async function POST(request: Request) {
  try {
    const { supabase } = await assertAdmin(request);
    const form = await request.formData();
    const file = form.get("file"); const nameColumn = form.get("nameColumn"); const numberColumn = form.get("numberColumn"); const action = form.get("action");
    if (!(file instanceof File) || typeof nameColumn !== "string" || !nameColumn) throw new Error("Pilih file dan kolom nama terlebih dahulu.");
    const parsed = await readRows(file, nameColumn, typeof numberColumn === "string" && numberColumn ? numberColumn : undefined);
    if (action === "preview") return NextResponse.json(parsed);
    if (action !== "import") throw new Error("Aksi impor tidak dikenal.");
    if (!parsed.valid.length) throw new Error("Tidak ada data valid untuk diimpor.");
    const { error } = await supabase.from("members").insert(parsed.valid);
    if (error) throw error;
    return NextResponse.json({ imported: parsed.valid.length, invalid: parsed.invalid, duplicates: parsed.duplicates });
  } catch (error) {
    const message = error instanceof ZodError ? "Data Excel tidak valid." : error instanceof Error ? error.message : "Impor gagal diproses.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
