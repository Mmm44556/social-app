"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function MainHeader() {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-sm p-2 border-b">
      <div className="flex items-center gap-6">
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-6" />
          </Button>
        </div>
        <div>
          <h1 className="text-xl font-bold">Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400"></p>
        </div>
      </div>
    </div>
  );
}
