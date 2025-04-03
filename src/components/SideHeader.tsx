"use client";
import { Bell, MoonIcon, SidebarIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/public/icon.png";

const ICON_SIZE = 20;

export function SiteHeader() {
  const { setTheme, theme = "light" } = useTheme();
  return (
    <header className="flex sticky top-0 z-50 w-full min-h-[64px] items-center  bg-background dark:bg-black border-transparent dark:border-gray-800">
      <div className="container !px-14 grid grid-cols-1 gap-4 md:auto-cols-fr grid-flow-col  h-[--header-height] w-full items-center p-1 py-2 justify-between  ">
        <h1 className="text-2xl font-bold col-span-4">
          <Link
            href="/"
            className="tracking-wide text-black text-4xl dark:text-white flex items-center gap-2 "
            style={{
              WebkitTextStroke: theme === "dark" ? "1px #000" : "1px #fff",
            }}
          >
            {/* <Image
              placeholder="blur"
              src={logo}
              alt="Chatter"
              className="w-10 h-10 dark:bg-gray-200 rounded-"
            /> */}
            Nexus
          </Link>
        </h1>
        <div className="col-span-9"></div>
        <div className="[&_button]:cursor-pointer  [&_button]:rounded-full flex items-center justify-end space-x-1 col-span-4 ">
          {/* <Button
            variant="ghost"
            size="icon"
            className="inline-flex items-center gap-2 m-0 whitespace-nowrap  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none md:w-40 lg:w-56 xl:w-60"
          >
            search
            <kbd className="pointer-events-none absolute right-[0.5rem] top-[0.4rem]  hidden h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button> */}
          <Button variant="ghost" size="icon" className="m-0">
            <Bell style={{ width: ICON_SIZE, height: ICON_SIZE }} />
          </Button>

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
        </div>
      </div>
    </header>
  );
}
