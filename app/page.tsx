import Link from "next/link";
import { StatusSearch } from "@/components/status-search";

export default function Home() {
  return <main>
    <header className="border-b border-slate-200 bg-white"><div className="shell flex min-h-16 items-center justify-between gap-4"><span className="wordmark text-lg text-ink">[NAMA ORGANISASI]</span><Link className="min-h-11 content-center text-sm font-bold text-ink underline underline-offset-4" href="/privacy">Privasi</Link></div></header>
    <div className="shell grid gap-10 py-12 sm:py-16 lg:grid-cols-[.86fr_1.14fr] lg:items-center lg:py-24">
      <section><p className="text-sm font-bold text-accent">Layanan informasi anggota</p><h1 className="mt-3 max-w-xl text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">Cek Status Keanggotaan</h1><p className="mt-5 max-w-lg text-lg leading-8 text-slate-700">Masukkan nama lengkap Anda untuk mengetahui status pendaftaran keanggotaan.</p><div className="mt-8 border-l-4 border-accent pl-4 text-sm leading-6 text-slate-700"><p className="font-bold">Gunakan layanan ini dengan bijak.</p><p>Hasil pencarian hanya menunjukkan pencatatan nama dan bukan bukti identitas atau hak keanggotaan.</p></div></section>
      <StatusSearch />
    </div>
    <footer className="border-t border-slate-200 bg-white"><div className="shell flex flex-col gap-2 py-6 text-sm text-slate-600 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} [NAMA ORGANISASI]</span><span>Kontak: [KONTAK ADMINISTRATOR]</span></div></footer>
  </main>;
}
