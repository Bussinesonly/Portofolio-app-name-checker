import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/admin-auth";
import { memberSchema } from "@/lib/validation";
import { normalizeName } from "@/lib/normalization";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase } = await assertAdmin(request); const { id } = await context.params;
    const body = memberSchema.parse(await request.json());
    const { error } = await supabase.from("members").update({ full_name: body.full_name.replace(/\s+/g, " "), member_number: body.member_number?.trim() || null, normalized_name: normalizeName(body.full_name) }).eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Pembaruan gagal." }, { status: 400 }); }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try { const { supabase } = await assertAdmin(request); const { id } = await context.params; const { error } = await supabase.from("members").delete().eq("id", id); if (error) throw error; return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : "Penghapusan gagal." }, { status: 400 }); }
}
