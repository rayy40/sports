import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/Providers";
import Navbar from "@/components/Navbar";
import { Analytics } from "@vercel/analytics/react";

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const revalidate = 15 * 60;

export const metadata: Metadata = {
  title: "Flooks",
  description: "A webapp to show data for different sports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} lg:flex bg-background h-screen text-foreground`}
      >
        <Navbar />
        <div className="h-full lg:flex-1">
          <Providers>{children}</Providers>
        </div>
      </body>
      <Analytics />
    </html>
  );
}
