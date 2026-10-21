"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

function getLoginErrorMessage(error: unknown) {
  const authError = error as { code?: string; message?: string };
  const message = authError.message?.toLowerCase() ?? "";

  if (authError.code === "invalid_credentials" || message.includes("invalid login credentials")) {
    return "Email atau kata sandi salah.";
  }

  if (authError.code === "email_not_confirmed") {
    return "Email belum dikonfirmasi. Periksa kotak masuk Anda.";
  }

  if (message.includes("konfigurasi supabase")) {
    return "Konfigurasi Supabase belum lengkap atau tidak valid.";
  }

  if (error instanceof TypeError || message.includes("failed to fetch")) {
    return "Tidak dapat terhubung ke Supabase. Periksa koneksi internet dan Project URL.";
  }

  return "Login gagal diproses. Silakan coba lagi.";
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");

    try {
      const { error } = await createBrowserSupabaseClient().auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.replace("/admin");
    } catch (error) {
      setMessage(getLoginErrorMessage(error));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(16,42,67,.10)]">
      <h1 className="text-2xl font-extrabold text-ink">Masuk administrator</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">Gunakan akun administrator yang dibuat melalui Supabase Auth.</p>

      <label className="mt-6 block text-sm font-bold" htmlFor="email">Email</label>
      <input id="email" type="email" required value={email} onChange={event => setEmail(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border-2 border-slate-300 px-3" autoComplete="email" />

      <label className="mt-4 block text-sm font-bold" htmlFor="password">Kata sandi</label>
      <input id="password" type="password" required value={password} onChange={event => setPassword(event.target.value)} className="mt-2 min-h-12 w-full rounded-lg border-2 border-slate-300 px-3" autoComplete="current-password" />

      {message && <p role="alert" className="mt-4 text-sm font-semibold text-red-800">{message}</p>}

      <button disabled={pending} className="mt-6 min-h-12 w-full rounded-lg bg-ink px-4 font-bold text-white disabled:bg-slate-500">
        {pending ? "Memeriksa akun..." : "Masuk"}
      </button>
    </form>
  );
}
