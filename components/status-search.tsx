"use client";
import { FormEvent, useState } from "react";

type Result = { status: "found"; fullName: string } | { status: "not_found" | "ambiguous" } | null;

export function StatusSearch() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setResult(null);
    if (!name.trim()) { setMessage("Masukkan nama lengkap Anda terlebih dahulu."); return; }
    setPending(true);
    try {
      const response = await fetch("/api/status", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setResult(data);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Terjadi gangguan jaringan. Coba lagi."); }
    finally { setPending(false); }
  }

  return <section aria-labelledby="form-title" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_rgba(16,42,67,.10)] sm:p-8">
    <h2 id="form-title" className="text-xl font-bold text-ink">Cari berdasarkan nama lengkap</h2>
    <form className="mt-5" onSubmit={submit} noValidate>
      <label htmlFor="full-name" className="mb-2 block text-sm font-bold text-slate-700">Nama lengkap</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input id="full-name" name="fullName" value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="Masukkan nama lengkap Anda" className="min-h-12 w-full rounded-lg border-2 border-slate-300 bg-white px-4 text-slate-900 placeholder:text-slate-500 sm:flex-1" aria-describedby="search-help search-feedback" />
        <button disabled={pending} className="min-h-12 rounded-lg bg-ink px-6 font-bold text-white transition hover:bg-[#173d60] disabled:cursor-wait disabled:bg-slate-500">{pending ? "Memeriksa status..." : "Cek Status"}</button>
      </div>
      <p id="search-help" className="mt-3 text-sm leading-6 text-slate-600">Gunakan ejaan nama seperti yang terdaftar. Pencarian ini tidak membuktikan identitas Anda.</p>
    </form>
    <div id="search-feedback" className="mt-5" aria-live="polite">
      {message && <p className="rounded-lg border border-red-800 bg-red-50 p-4 text-sm font-semibold text-red-900">Masalah: {message}</p>}
      {result?.status === "found" && <div className="rounded-lg border border-emerald-800 bg-emerald-50 p-5 text-emerald-950"><p className="font-bold">✓ TERDAFTAR</p><p className="mt-2 text-lg font-bold">{result.fullName}</p><p className="mt-1 text-sm">Nama ini ditemukan pada data keanggotaan.</p></div>}
      {result?.status === "not_found" && <div className="rounded-lg border border-slate-500 bg-slate-50 p-5 text-slate-900"><p className="font-bold">Informasi: NAMA TIDAK TERDAFTAR</p><p className="mt-2 text-sm">Periksa kembali ejaan nama Anda atau hubungi administrator.</p></div>}
      {result?.status === "ambiguous" && <div className="rounded-lg border border-amber-700 bg-amber-50 p-5 text-amber-950"><p className="font-bold">Verifikasi tambahan diperlukan</p><p className="mt-2 text-sm">Terdapat lebih dari satu anggota dengan nama yang sama. Hubungi administrator untuk verifikasi.</p></div>}
    </div>
  </section>;
}
