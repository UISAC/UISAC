import type { Metadata, Viewport } from "next";
import { Archivo, Bricolage_Grotesque } from "next/font/google";
import SiteNav from "./components/site-nav";
import { AuthProvider } from "./components/auth-provider";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UISAC",
  description:
    "Resource hub for international student support, advocacy, events, sponsor acknowledgment, and tax filing guidance.",
  icons: {
    icon: [
      { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/images/apple-touch-icon.png",
  },
  // iOS has no install prompt; this is what makes Add to Home Screen open
  // the site standalone rather than in a Safari tab.
  appleWebApp: {
    capable: true,
    title: "UISAC",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#4e2a84",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${bricolage.variable} antialiased`}>
        <AuthProvider>
          <SiteNav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
