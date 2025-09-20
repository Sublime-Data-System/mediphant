import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mediphant Dev Test",
  description: "A practical test for Mediphant developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="main-container">
          <header className="header">
            <h1>Mediphant Dev Test</h1>
            <nav>
              <a href="/interactions">Interaction Checker</a>
              <a href="/faq">FAQ Search</a>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
