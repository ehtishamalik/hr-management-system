import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Figtree } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

import type { Metadata } from "next";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HRM",
  description: "A Human Resources Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${figtree.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            toastOptions={{
              unstyled: true,
              className:
                "p-4 rounded-md shadow-lg text-sm flex items-center gap-3 w-[var(--width)]",
              classNames: {
                success: "bg-emerald-600 text-neutral-100",
                error: "bg-destructive text-neutral-100",
                title: "text-base font-medium mb-1 capitalize",
              },
            }}
          />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
