import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { getCurrentUser } from "@/lib/auth/server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://my-helper.app"),
  title: "my-helper",
  description: "Find local service requests, create provider profiles, and unlock qualified leads.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "my-helper",
    description: "Find local service requests, create provider profiles, and unlock qualified leads.",
    url: "https://my-helper.app",
    siteName: "my-helper",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "my-helper service request marketplace preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "my-helper",
    description: "Find local service requests, create provider profiles, and unlock qualified leads.",
    images: ["/opengraph-image"],
  },
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
