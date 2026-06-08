import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student Notes",
  description: "Simple notes app for students",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-indigo-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
