import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Production Schedule | Milano 2026",
  description: "Production team schedule for the 21-day Olympic event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
