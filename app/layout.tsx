import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Cek Status Keanggotaan", description: "Pengecekan status keanggotaan organisasi." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
