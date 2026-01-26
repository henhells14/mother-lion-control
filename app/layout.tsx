import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Production Schedule | Milano 2026",
  description: "Production team schedule for the 21-day Olympic event",
  // TÄMÄ RIVI ALTA: Estää selaimia muokkaamasta numeroita linkeiksi
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Lisätty suppressHydrationWarning ja muutettu kieleksi fi
    <html lang="fi" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}