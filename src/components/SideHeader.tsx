"use client";
import { MoonIcon, SidebarIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png";
const ICON_SIZE = 20;
export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const { setTheme, theme } = useTheme();
  return (
    <header className="flex sticky top-0 z-50 w-full items-center border-b bg-background dark:bg-black border-transparent dark:border-gray-800">
      <div className="flex h-[--header-height] w-full items-center p-1 py-2 justify-between">
        <h1 className="text-2xl font-bold ">
          <Link
            href="/"
            className="tracking-wide text-black text-4xl dark:text-white flex items-center gap-2"
            style={{
              WebkitTextStroke: theme === "dark" ? "1px #000" : "1px #fff",
            }}
          >
            <Image
              src={logo}
              alt="Chatter"
              className="w-10 h-10 dark:bg-gray-200 rounded-"
            />
            Chatter
          </Link>
        </h1>
        <div
          className={cn(
            "[&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-300 [&_button]:ease-in-out [&_button]:rounded-full",
            theme === "dark"
              ? "[&_button]:text-white [&_button]:hover:bg-gray-900"
              : "[&_button]:text-black [&_button]:hover:bg-gray-200"
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <SunIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            ) : (
              <MoonIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <SidebarIcon style={{ width: ICON_SIZE, height: ICON_SIZE }} />
          </Button>
        </div>
      </div>
    </header>
  );
}
