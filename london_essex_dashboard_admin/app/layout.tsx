import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReduxProvider } from "@/components/providers/redux-provider";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../public/fonts/satoshi/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "../public/fonts/satoshi/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
  fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: "London Essex Admin",
  description: "Admin dashboard sign in",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${satoshi.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-[var(--background)] text-[var(--foreground)] font-sans"
        suppressHydrationWarning
      >
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
