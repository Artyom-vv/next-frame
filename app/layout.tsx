import "../styles/globals.css";
import type {Metadata, Viewport} from "next";
import {Montserrat, Manrope} from "next/font/google";
import Header from "@/components/layout/Header";
import React from "react";
import LenisProvider from "@/components/providers/LenisProvider";
import Footer from "@/components/layout/Footer";
import YandexMetrika from "@/components/providers/YandexMetrika";
import CookieConsent from "@/components/CookieConsent";
import {siteDescription, siteKeywords, siteName, siteOgImage, siteTitle, siteUrl} from "@/config/site";

const montserrat = Montserrat({
    subsets: ["latin", "cyrillic"],
    variable: "--font-montserrat",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

const manrope = Manrope({
    subsets: ["latin", "cyrillic"],
    variable: "--font-manrope",
    weight: ["400", "500", "600", "700"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: {
        default: siteTitle,
        template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: siteKeywords,
    authors: [{name: siteName}],
    creator: siteName,
    publisher: siteName,
    category: "Строительство",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "ru_RU",
        url: "/",
        siteName,
        title: siteTitle,
        description: siteDescription,
        images: [siteOgImage],
    },
    twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description: siteDescription,
        images: ["/hero.png"],
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
    icons: {
        icon: [
            {url: "/favicon.ico", sizes: "any"},
            {url: "/favicon.svg", type: "image/svg+xml"},
            {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
            {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
        ],
        apple: [
            {url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png"},
        ],
        other: [
            {
                rel: "mask-icon",
                url: "/safari-pinned-tab.svg",
                color: "#1D2020",
            },
        ],
    },
    manifest: "/site.webmanifest",
    appleWebApp: {
        capable: true,
        title: siteName,
        statusBarStyle: "black-translucent",
    },
    formatDetection: {
        telephone: true,
        email: true,
        address: false,
    },
    referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
    themeColor: "#1D2020",
    colorScheme: "light",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body
            className={`${montserrat.variable} ${manrope.variable}`}>
        <div className="wrapper flex flex-col min-h-screen overflow-x-hidden">
            <Header/>
            <LenisProvider>
                {children}
            </LenisProvider>
            <Footer/>
        </div>
        <CookieConsent/>
        <YandexMetrika/>
        </body>
        </html>
    );
}
