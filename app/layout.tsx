import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Receipsonist AI Agent",
  description:
    "An AI-powered receptionist that triages visitors, schedules appointments, and captures requests."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
