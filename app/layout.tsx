import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zuhio Keyword Count Checker - Free Word Counter & SEO Tool",
  description: "Free online keyword count checker by Zuhio. Analyze word count, character count, keyword density, and SEO optimization for your content. No registration required.",
  keywords: ["keyword counter", "word count", "keyword density", "SEO tool", "free keyword checker", "text analyzer", "zuhio"],
  authors: [{ name: "Zuhio" }],
  openGraph: {
    title: "Zuhio Keyword Count Checker - Free SEO Tool",
    description: "Analyze word count, keyword density, and SEO optimization",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
