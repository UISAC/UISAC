import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import SiteNav from "./components/site-nav";
import { AuthProvider } from "./components/auth-provider";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "UISAC",
  description:
    "Resource hub for international student support, advocacy, events, sponsor acknowledgment, and tax filing guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} antialiased`}>
        <AuthProvider>
          <SiteNav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
