import type React from "react";
import "@/style/global.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/nav/AppSidebar";
import { SiteHeader } from "@/components/SideHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chatter - Share Your World",
  description:
    "A modern social platform for sharing content with your friends and family",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider className="flex flex-col" defaultOpen={false}>
              <SiteHeader />
              <div className="flex flex-1">
                <AppSidebar />
                <main className="w-full">{children}</main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
