import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InitialPageLoader } from "@/components/common/InitialPageLoader";

export const viewport: Viewport = {
  themeColor: "#e60012",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://shinosuke.vercel.app"),
  title: "SHIN-CHAN! - HEY, HEY, HEY! Official Fan Hub",
  description:
    "Official Kasukabe Defense Group Fan Hub for Shinnosuke Nohara. Explore high-energy mischief, chocolate star snacks, characters, moments gallery, and Kasukabe City!",
  keywords: [
    "Shin-chan",
    "Shinnosuke Nohara",
    "Kasukabe Defense Group",
    "Action Mask",
    "Anime 90s",
    "Chocobi",
    "Neo-Brutalism",
  ],
  authors: [{ name: "Usui Yoshito / Shin-ei Animation" }],
  openGraph: {
    title: "SHIN-CHAN! - HEY, HEY, HEY! Official Fan Hub",
    description:
      "Join Shinnosuke Nohara for high-energy mischief and Action Mask adventures in Kasukabe!",
    url: "https://shinosuke.vercel.app",
    siteName: "Shinosuke Fan Hub",
    images: [
      {
        url: "/images/home-1-a-dynamic-high-energy-illustra.jpg",
        width: 1200,
        height: 630,
        alt: "Shinnosuke Nohara Hero",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SHIN-CHAN! Official Fan Hub",
    description:
      "Join Shinnosuke Nohara for high-energy mischief and Action Mask adventures in Kasukabe!",
    images: ["/images/home-1-a-dynamic-high-energy-illustra.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600&family=Space+Grotesk:wght@700&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-background selection:bg-secondary-container selection:text-on-secondary-container min-h-screen">
        <InitialPageLoader />
        {children}
      </body>
    </html>
  );
}
