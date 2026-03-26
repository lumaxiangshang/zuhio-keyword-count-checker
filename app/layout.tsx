import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zuhio Keyword Count Checker - Free Word Counter & SEO Tool",
  description: "Free online keyword count checker by Zuhio. Analyze word count, character count, keyword density, and SEO optimization for your content. No registration required.",
  keywords: ["keyword counter", "word count", "keyword density", "SEO tool", "free keyword checker", "text analyzer", "zuhio", "content optimizer"],
  authors: [{ name: "Zuhio" }],
  creator: "Zuhio",
  publisher: "Zuhio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://zuhio.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Zuhio Keyword Count Checker - Free SEO Tool",
    description: "Analyze word count, keyword density, and SEO optimization for your content",
    url: "https://zuhio.com",
    siteName: "Zuhio Keyword Count Checker",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Zuhio Keyword Count Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zuhio Keyword Count Checker",
    description: "Free online keyword count checker tool",
    creator: "@zuhio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
