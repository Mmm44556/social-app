"use client";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LinkIcon, Redo2 } from "lucide-react";
import type { PostType } from "@/types/post";

interface ShareButtonProps {
  comment: PostType;
  onEvent?: (event: "share") => void;
}
export default function ShareButton({}: ShareButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="none"
          onClick={(e) => e.stopPropagation()}
        >
          <Redo2 className="size-5" />
          <span className="text-sm">0</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        className="[&_div]:hover:bg-gray-100 [&_div]:hover:cursor-pointer "
      >
        <DropdownMenuItem>
          Copy link <LinkIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
