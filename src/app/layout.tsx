import type React from "react";
import "@/styles/global.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import AppRightSidebar from "@/components/nav/AppRightSidebar";
import AppLeftSidebar from "@/components/nav/AppLeftSidebar";
import QueryClientComponent from "@/components/QueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MobileNav } from "@/components/nav/MobileNav";
import { MobileHeader } from "@/components/nav/MobileHeader";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Nexus - Share Your World",
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
            <QueryClientComponent>
              {/* Header */}
              <MobileHeader title="Nexus" />

              {/* <SiteHeader /> */}
              <div className="grid auto-cols-fr grid-flow-col gap-3 container py-6 max-sm:gap-0">
                {/* Left Sidebar */}
                <AppLeftSidebar />

                {/* Main Content */}
                {children}
                <MobileNav />

                {/* Right Sidebar */}
                <AppRightSidebar />
              </div>
              <ReactQueryDevtools />
            </QueryClientComponent>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
