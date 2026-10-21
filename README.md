# Pengecekan Status Keanggotaan

Aplikasi Next.js untuk mengecek status keanggotaan melalui nama lengkap serta mengelola data melalui dashboard admin.

## Menjalankan lokal

1. Salin `.env.example` menjadi `.env.local`, lalu isi kredensial proyek Supabase.
2. Jalankan migration `supabase/migrations/202610210001_initial_schema.sql` di Supabase SQL Editor.
3. Opsional untuk demo lokal, jalankan `supabase/seed.sql` setelah migration.
4. Buat pengguna pertama di **Authentication > Users**, lalu tetapkan perannya dengan query yang dicantumkan pada akhir migration. Tidak ada kredensial bawaan.
5. Instal dependensi dan jalankan aplikasi:

```bash
npm install
npm run dev
```

## Format Excel

Gunakan `.xlsx` atau `.xls` berukuran maksimal 5 MB. Format minimum:

| nomor_anggota | nama_lengkap |
| --- | --- |
| D-019 | Contoh Nama |

`nomor_anggota` opsional. Di dashboard admin, pilih header yang sesuai sebelum pratinjau. Server kembali memvalidasi file, menolak baris kosong atau nama tidak valid, menghitung duplikat dalam file, dan melakukan satu operasi insert. Data lama tidak dihapus atau ditimpa otomatis.

## Keamanan

- Route publik mengembalikan hanya status dan satu nama yang cocok tepat. Nama ganda menghasilkan permintaan verifikasi tambahan.
- Tabel `members` memakai RLS dan tidak memiliki policy untuk pengguna anonim.
- `SUPABASE_SERVICE_ROLE_KEY` hanya dipakai di server, jangan pernah awali variabel ini dengan `NEXT_PUBLIC_`.
- Endpoint status memiliki pembatasan permintaan in-memory. Untuk deployment multi-instance Vercel, gunakan rate limiter persisten seperti Upstash Redis sebelum publikasi.

## Deploy ke Vercel

1. Push repository ini ke GitHub lalu impor repository di Vercel.
2. Tambahkan tiga environment variable dari `.env.example` pada Vercel.
3. Pastikan URL produksi Vercel ditambahkan ke **Authentication > URL Configuration** di Supabase.
4. Jalankan `npm run build` sebelum deploy.
5. Uji status ditemukan, tidak ditemukan, nama ganda, file invalid, impor valid, login admin, logout, serta tampilan lebar 320 px sebelum publikasi.

## Catatan operasional

Pencarian nama tidak membuktikan identitas pemohon. Jangan menambahkan data sensitif ke hasil publik atau memakai data anggota nyata untuk demonstrasi.
