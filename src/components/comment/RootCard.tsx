"use client";

import type { PostType } from "@/types/post";
import useNavigateToComment from "@/hooks/useNaivagteToComment";
import ReplyCard from "./ReplyCard";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RootCardProps {
  post: PostType;
  dbUserId: string | null;
  className?: string;
  enableConnectedLine?: boolean;
}

export default function RootCard({
  post,
  dbUserId,
  className,
  enableConnectedLine = false,
}: RootCardProps) {
  const navigateToComment = useNavigateToComment();
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div
      className={cn(
        "flex items-stretch gap-2 hover:bg-gray-50 hover:cursor-pointer",
        className
      )}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON" || isDragging) return;
        navigateToComment(post.author.tagName, post.id);
      }}
      onMouseDown={() => setIsDragging(false)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={() => setIsDragging(true)}
    >
      {/* Post Content */}
      <ReplyCard
        comment={post}
        dbUserId={dbUserId}
        disableShowMore={true}
        enableConnectedLine={enableConnectedLine}
        className="hover:bg-transparent"
      />
    </div>
  );
}
