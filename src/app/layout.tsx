import type React from "react";
import "@/styles/global.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { SiteHeader } from "@/components/SideHeader";
import AppRightSidebar from "@/components/nav/AppRightSidebar";
import AppLeftSidebar from "@/components/nav/AppLeftSidebar";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ｎexus - Share Your World",
  description:
    "A modern social platform for sharing content with your friends and family",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="icon"
            href="/public/icon.png"
            type="image/png"
            sizes="32x32"
          />
        </head>
            <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {/* Header */}
            <SiteHeader />
            <div className="grid grid-cols-1 gap-4 md:auto-cols-fr grid-flow-col  container py-8">
              {/* Left Sidebar */}
              <AppLeftSidebar />

              {/* Main Content */}
              {children}
              {/* Right Sidebar */}
              <AppRightSidebar />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
