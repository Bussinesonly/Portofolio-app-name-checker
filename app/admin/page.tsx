import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/dashboard";
import { MemberManager } from "@/components/admin/member-manager";
import { MemberCreateForm } from "@/components/admin/member-create-form";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/admin/login");
  const { count } = await supabase.from("members").select("id", { count: "exact", head: true });
  const { data: members } = await supabase.from("members").select("id,full_name,member_number,created_at").order("created_at", { ascending: false }).limit(50);
  return <><AdminDashboard initialCount={count ?? 0} initialMembers={members ?? []} /><div className="shell"><MemberCreateForm /><MemberManager members={members ?? []} /></div></>;
}
