import "@/styles/globals.css";
import { Viewport } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { ReduxProvider } from "@/app/redux/features/provider";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Medishifts.in",
  description: "Job portal for Medical Professionals - Doctors, Nurses",
  icons: {
    icon: [
      { rel: "icon", url: "/icons/favicon-16x16.png", sizes: "16x16" },
      { rel: "icon", url: "/icons/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", url: "/icons/favicon.ico" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/icons/site.webmanifest",
  // themeColor: "#ffffff",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow some zooming for accessibility
  minimumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
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
              <Footer />
            </div>
          </Providers>
        </ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
