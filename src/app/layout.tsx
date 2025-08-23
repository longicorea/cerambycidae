import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Navigation from "@src/components/Navigation";
import {ThemeProvider} from "@src/contexts/ThemeContext";
import ThemeScript from "@src/components/ThemeScript";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Longicorea",
    description: "longicorea",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <ThemeScript />
        </head>
        <body className={`${inter.className} bg-white dark:bg-slate-950 text-black dark:text-white transition-colors`}>
        <ThemeProvider>
            <Navigation/>
            <div className={"py-0 px-10"}>
                {children}
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
