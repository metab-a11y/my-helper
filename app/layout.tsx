import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "my-helper",
  description: "Find local service requests, create provider profiles, and unlock qualified leads.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
