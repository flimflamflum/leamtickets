import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "LeamTickets – Student Ticket Resale for Smack & Neon",
  description:
    "Buy and sell tickets for Smack and Neon in Leamington Spa. A student-to-student resale marketplace for University of Warwick students.",
  keywords: ["tickets", "Smack", "Neon", "Leamington Spa", "Warwick", "student", "resale"],
  openGraph: {
    title: "LeamTickets",
    description: "Student ticket resale for Smack & Neon, Leamington Spa.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
