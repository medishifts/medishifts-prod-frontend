"use client";
import "@/styles/globals.css";
import { Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";


import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { ReduxProvider } from "@/app/redux/features/provider";
import { Toaster } from "react-hot-toast";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReduxProvider>
          <Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
            <div className="relative flex flex-col h-screen">
              <Navbar />
              <main className="container mx-auto max-w-full pt-5 px-2 flex-grow">
                {children}
              </main>
            </div>
          </Providers>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
