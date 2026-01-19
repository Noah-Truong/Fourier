import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fourier Series Visualizer",
  description: "Interactive visualization of Fourier series decomposition with customizable parameters and real-time mathematical metrics",
  keywords: ["Fourier", "series", "visualization", "mathematics", "harmonics", "waveform"],
  authors: [{ name: "Fourier Visualizer" }],
  openGraph: {
    title: "Fourier Series Visualizer",
    description: "Interactive visualization of Fourier series decomposition",
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
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
