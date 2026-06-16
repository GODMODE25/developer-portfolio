import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samuel Musa | Systems Engineer & Builder",
  description: "A cyber-minimal developer portfolio for AI, compiler, fintech, and systems engineering work.",
  openGraph: {
    title: "Samuel Musa | Systems Engineer & Builder",
    description: "Interactive portfolio, project systems, skills graph, and technical engineering logs.",
    type: "website",
  },
  icons: {
    icon: "/favicon.png?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col w-full overflow-x-hidden">{children}</body>
    </html>
  );
}
