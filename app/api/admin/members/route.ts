import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { memberSchema } from "@/lib/validation";
import { normalizeName } from "@/lib/normalization";

export async function POST(request: Request) {
  try {
    const { supabase } = await assertAdmin(request);
    const member = memberSchema.parse(await request.json());
    const { error } = await supabase.from("members").insert({
      full_name: member.full_name.replace(/\s+/g, " "),
      member_number: member.member_number?.trim() || null,
      normalized_name: normalizeName(member.full_name)
    });
    if (error?.code === "23505") throw new Error("Nomor anggota tersebut sudah digunakan.");
    if (error) throw error;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "Data anggota tidak dapat ditambahkan." }, { status: 400 });
  }
}
