import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TAIBAL SUPPLY | Premium TCG Supply",
  description:
    "海外のプレミアムTCGサプライを日本向けに選定するTAIBAL SUPPLY。First DropはTCEvolutions。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <div className="topbar">FIRST DROP — TCEVOLUTIONS / OCTOBER 2026</div>
        <header className="siteHeader">
          <div className="shell nav">
            <Link href="/" className="brand">
              TAIBAL <span>SUPPLY</span>
            </Link>
            <nav className="navLinks">
              <Link href="/#collection">COLLECTION</Link>
              <Link href="/#tce">TCEVOLUTIONS</Link>
              <Link href="/about">ABOUT</Link>
              <Link href="/faq">FAQ</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="siteFooter">
          <div className="shell footerGrid">
            <div>
              <div className="footerBrand">TAIBAL SUPPLY</div>
              <div className="footerNote">Premium TCG Supply Select Shop / Tokyo, Japan</div>
            </div>
            <div className="footerLinks">
              <Link href="/legal">特定商取引法に基づく表記</Link>
              <Link href="/privacy">プライバシーポリシー</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}