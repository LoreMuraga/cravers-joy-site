import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/MainNav";
import Footer from "@/components/Footer";
import OrderModalWrapper from "@/components/OrderModalWrapper";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cravers Joy Cakes | Wedding, Birthday & Kids' Cakes",
  description: "Custom cakes for every occasion. Wedding cakes, birthday cakes, kids' themed cakes, and more. Order online from Kenyatta Road, Kiambu.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: "#FAF6F0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} scroll-smooth`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-blush selection:text-white bg-cream text-mahogany">
        <MainNav />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <OrderModalWrapper />
      </body>
    </html>
  );
}
