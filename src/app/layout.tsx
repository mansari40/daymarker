import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daymark — Make a mark of today",
  description:
    "A quieter way to plan. Minimalist daily intentions for focused, calm productivity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`} data-theme="dark">
      <body className="min-h-screen bg-bg-base text-text-primary">
        {children}
      </body>
    </html>
  );
}
