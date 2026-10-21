import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { allowRequest } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatedName } from "@/lib/validation";

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "unknown";
  if (!allowRequest(key)) return NextResponse.json({ message: "Terlalu banyak permintaan. Coba lagi dalam satu menit." }, { status: 429 });
  try {
    const { name } = await request.json();
    const { normalizedName } = validatedName(name);
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("members").select("full_name").eq("normalized_name", normalizedName).limit(2);
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ status: "not_found" });
    if (data.length > 1) return NextResponse.json({ status: "ambiguous" });
    return NextResponse.json({ status: "found", fullName: data[0].full_name });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ message: error.issues[0]?.message ?? "Nama tidak valid." }, { status: 400 });
    return NextResponse.json({ message: "Pencarian tidak dapat diproses. Silakan coba lagi." }, { status: 500 });
  }
}
