import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/lib/providers";

const inter = Roboto_Mono({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "FingerIt",
  description: "FingerIt is a platform to improve your typing speed by helping you build muscle memory",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          {children}
          <div className="absoulute bottom-5 text-[15px] w-full text-center">
            UI inspired by Monkeytype.com
          </div>
        </Providers>
      </body>
    </html>
  );
}
