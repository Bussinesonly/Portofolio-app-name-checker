"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function MemberCreateForm() {
  const [fullName, setFullName] = useState("");
  const [memberNumber, setMemberNumber] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!fullName.trim()) { setMessage("Nama lengkap wajib diisi."); return; }
    setPending(true);
    try {
      const { data } = await createBrowserSupabaseClient().auth.getSession();
      if (!data.session) throw new Error("Sesi berakhir. Silakan masuk kembali.");
      const response = await fetch("/api/admin/members", {
        method: "POST",
        headers: { Authorization: `Bearer ${data.session.access_token}`, "content-type": "application/json" },
        body: JSON.stringify({ full_name: fullName, member_number: memberNumber || null })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setFullName(""); setMemberNumber(""); setMessage("Data anggota berhasil ditambahkan."); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Data anggota gagal ditambahkan."); }
    finally { setPending(false); }
  }

  return <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 sm:p-7">
    <h2 className="text-xl font-extrabold text-ink">Tambah anggota</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">Gunakan formulir ini untuk menambahkan satu data anggota tanpa mengimpor file Excel.</p>
    <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
      <label className="text-sm font-bold" htmlFor="add-member-name">Nama lengkap
        <input id="add-member-name" value={fullName} onChange={event => setFullName(event.target.value)} maxLength={120} className="mt-2 min-h-11 w-full rounded-lg border-2 border-slate-300 px-3" placeholder="Masukkan nama lengkap" />
      </label>
      <label className="text-sm font-bold" htmlFor="add-member-number">Nomor anggota (opsional)
        <input id="add-member-number" value={memberNumber} onChange={event => setMemberNumber(event.target.value)} maxLength={60} className="mt-2 min-h-11 w-full rounded-lg border-2 border-slate-300 px-3" placeholder="Contoh: D-019" />
      </label>
      <div className="sm:col-span-2"><button disabled={pending} className="min-h-12 rounded-lg bg-ink px-5 font-bold text-white disabled:bg-slate-500">{pending ? "Menyimpan data..." : "Tambah anggota"}</button></div>
    </form>
    {message && <p role="status" className="mt-4 rounded-lg bg-mist p-3 text-sm font-semibold text-ink">{message}</p>}
  </section>;
}
