import type { Metadata } from "next";
import { Inter, Questrial, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const questrial = Questrial({
  variable: "--font-questrial",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://employee-atlas.vercel.app";

const DESCRIPTION =
  "Workforce intelligence for multi-location companies — map-based employee discovery, directory, and analytics.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Employee Atlas",
    template: "%s · Employee Atlas",
  },
  description: DESCRIPTION,
  applicationName: "Employee Atlas",
  openGraph: {
    type: "website",
    siteName: "Employee Atlas",
    title: "Employee Atlas",
    description: DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        // Light-theme banner: the only full-width lockup whose wordmark is
        // not clipped (the dark/gradient 1600x480 exports cut the final "s").
        url: "/logo-assets/employee-atlas-logo-light-theme-1600x480.png",
        width: 1600,
        height: 480,
        alt: "Employee Atlas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Atlas",
    description: DESCRIPTION,
    images: ["/logo-assets/employee-atlas-logo-light-theme-1600x480.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${questrial.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
