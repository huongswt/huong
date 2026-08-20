import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusePay",
  description: "Agents commission. Humans create. USDC settles.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
