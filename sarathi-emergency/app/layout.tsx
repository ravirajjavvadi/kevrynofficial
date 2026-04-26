import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/shared";
import { LanguageProvider } from "@/components/shared/LanguageProvider";
import { SpaceBackdrop } from "@/components/shared/SpaceBackdrop";
import { InstallAppButton } from "@/components/pwa/InstallAppButton";

const interSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SARATHI - Emergency Navigation System",
  description: "AI-powered emergency response platform for ambulance, police, and fire services. Smart routing, hospital selection, and real-time coordination.",
  keywords: ["emergency navigation", "ambulance routing", "hospital finder", "AI emergency response", "green corridor", "sarathi"],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SARATHI",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "SARATHI - Emergency Navigation System",
    description: "AI-powered emergency response for ambulance, police & fire services. Save lives with smart routing & real-time hospital coordination.",
    type: "website",
    locale: "en_IN",
    siteName: "SARATHI Emergency",
  },
  twitter: {
    card: "summary_large_image",
    title: "SARATHI - Emergency Navigation System",
    description: "AI-powered emergency response platform. Smart routing, hospital finder & real-time coordination for first responders.",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places,routes,marker`}
        />
        <meta name="theme-color" content="#991b1b" />
      </head>
      <body
        className={`${interSans.variable} ${robotoMono.variable} antialiased bg-gray-950 text-white overflow-x-hidden`}
      >
        <LanguageProvider>
          <SpaceBackdrop />
          <div className="relative z-10">
            <Navbar />
            {children}
            <InstallAppButton />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
