import type { Metadata } from "next";
import { Space_Grotesk, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "Northeast Young Founders Summit - NYFS",
  description: "A 3-day high-octane mentorship summit for the next generation of founders in the Northeast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${bricolage.variable}`} suppressHydrationWarning>
       <head>
          <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
       </head>
      <body className="antialiased selection:bg-brand selection:text-dark-teal min-h-screen" suppressHydrationWarning>
        <div className="noise" />
        <div className="scanline" />
        {children}
      </body>
    </html>
  );
}
