import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "my-helper",
  description: "Find local service requests, create provider profiles, and unlock qualified leads.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header className="site-header">
          <a className="brand" href="/">my-helper</a>
          <nav>
            <a href="/requests">Requests</a>
            <a href="/providers">Providers</a>
            <a href="/leads">Leads</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
