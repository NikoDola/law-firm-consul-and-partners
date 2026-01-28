import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import "@/components/NavBar.css";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/SiteFooter";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});


export const metadata: Metadata = {
  title: "International Legal Advisory",
  description:
    "International legal advisory services covering insolvency administration, EU driving licence consulting, asset management and company relocation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable}`}
      >
        <a className="srOnly" href="#content">
          Skip to content
        </a>
        <NavBar />
        <div id="content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
