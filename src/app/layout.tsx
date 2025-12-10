import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imaginative 369",
  description: "Interior Design Studio Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />
            <title>Imaginative 369</title>
            <meta name="description" content="Interior Design Studio Portfolio" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Sans+Sinhala:wght@300;400;500;600&family=Noto+Sans+Tamil:wght@300;400;500;600&display=swap" rel="stylesheet" />
        </head>
      <body className={inter.className}>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
