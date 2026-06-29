import "./globals.css";

import type * as React from "react";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Figtree } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import { BrandProvider } from "@/components/brand-provider";

import type { Metadata } from "next";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR Management System",
  description: "Human Resources Management System",
  authors: [{ name: "ehtishamalik" }],
  keywords: [
    "HRM",
    "Human Resources Management",
    "Employee Management",
    "Payroll",
    "Attendance Tracking",
    "Performance Reviews",
  ],
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: false,
  },
  appleWebApp: {
    title: "HR Management System",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} antialiased`}>
        <BrandProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              toastOptions={{
                duration: 4000,
                closeButton: true,
                unstyled: true,
                className:
                  "p-4 rounded-md shadow-lg text-sm flex items-center gap-3 w-[var(--width)]",
                classNames: {
                  success: "bg-emerald-600 text-neutral-100",
                  error: "bg-destructive text-neutral-100",
                  info: "bg-blue-600 text-neutral-100",
                  title: "text-base font-medium mb-1 capitalize",
                  closeButton:
                    "absolute top-3 right-3 [&_svg]:size-4 cursor-pointer",
                },
              }}
            />
          </ThemeProvider>
        </BrandProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
