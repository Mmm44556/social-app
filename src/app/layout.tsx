import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from "@clerk/nextjs";
import AppRightSidebar from "@/components/nav/AppRightSidebar";
import AppLeftSidebar from "@/components/nav/AppLeftSidebar";
import QueryClientComponent from "@/components/QueryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { MobileNav } from "@/components/nav/MobileNav";
import { MobileHeader } from "@/components/nav/MobileHeader";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/global.css";
import { ChatProvider } from "@/contexts/ChatContext";
import { getDbUser } from "@/app/actions/user.action";
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
  const dbUser = await getDbUser();
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className="h-dvh">
        <head>
          <link
            rel="icon"
            href="/public/icon.png"
            type="image/png"
            sizes="32x32"
          />
        </head>
        <body className={inter.className + " h-full"}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <QueryClientComponent>
              <ChatProvider>
                {/* Header */}
                <MobileHeader title="Nexus" />

                {/* <SiteHeader /> */}
                <div className="h-full grid auto-cols-fr grid-flow-col gap-3 container max-sm:gap-0 max-lg:pt-10 max-lg:pb-16 max-xl:overflow-y-auto">
                  {/* Left Sidebar */}
                  <AppLeftSidebar />

                  {/* Main Content */}
                  {children}
                  <MobileNav />

                  {/* Right Sidebar */}
                  <AppRightSidebar dbUser={dbUser} />
                </div>
                <ReactQueryDevtools />
              </ChatProvider>
            </QueryClientComponent>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
