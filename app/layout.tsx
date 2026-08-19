import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arc Creator Agent",
  description: "Agents commission. Humans create. USDC settles on Arc.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
