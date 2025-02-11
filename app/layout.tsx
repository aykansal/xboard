import type { Metadata } from "next";
import "@/styles/globals.css";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const metadata: Metadata = {
  title: "XBoard",
  description:
    "Track your X (Twitter) activity with an interactive heatmap and generate custom banners",
};

// Define fallback system fonts
const fallbackFonts = 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${GeistSans.variable} ${GeistMono.variable} dark`}
      style={{ fontFamily: `var(--font-geist-sans, ${fallbackFonts})` }}
    >
      <body className="antialiased font-['VT323'] text-base leading-relaxed">
        {children}
      </body>
    </html>
  );
}