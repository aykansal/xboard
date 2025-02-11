import type { Metadata } from "next";
import "@/styles/globals.css";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "XBoard",
  description:
    "Track your Twitter activity Heatmap and generate custom banners sotred as NFTs",
};

const qsLit = localFont({
  src: "./fonts/QuicksandLight.woff",
  variable: "--font-qsLit",
  weight: "300 700",
});

const qsReg = localFont({
  src: "./fonts/QuicksandRegular.woff",
  weight: "300 700",
  variable: "--font-qsReg",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${qsLit.variable} ${qsReg.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
