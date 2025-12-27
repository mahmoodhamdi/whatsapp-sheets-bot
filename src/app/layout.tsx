import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics";
import { localeDirection, type Locale } from "@/i18n/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXTAUTH_URL || "https://whatsappbot.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "WhatsApp Auto-Reply Bot | Automate Your Business",
    template: "%s | WhatsApp Bot",
  },
  description:
    "Automate your WhatsApp responses and sync with Google Sheets. Perfect for stores, clinics, and restaurants in Saudi Arabia and Egypt. Free to start.",
  keywords: [
    "whatsapp bot",
    "auto reply",
    "whatsapp automation",
    "google sheets integration",
    "business automation",
    "saudi arabia",
    "egypt",
    "بوت واتساب",
    "رد تلقائي",
  ],
  authors: [{ name: "WhatsApp Bot Team" }],
  creator: "WhatsApp Bot",
  publisher: "WhatsApp Bot",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    url: baseUrl,
    siteName: "WhatsApp Bot",
    title: "WhatsApp Auto-Reply Bot | Automate Your Business",
    description:
      "Automate your WhatsApp responses and sync with Google Sheets. Perfect for stores, clinics, and restaurants.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WhatsApp Bot - Auto Reply & Google Sheets Integration",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WhatsApp Auto-Reply Bot | Automate Your Business",
    description:
      "Automate your WhatsApp responses and sync with Google Sheets.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these when you have the codes
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const direction = localeDirection[locale];

  return (
    <html lang={locale} dir={direction}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleAnalytics
          measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster position={direction === "rtl" ? "top-left" : "top-right"} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
