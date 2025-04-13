"use client";

import type { PostType } from "@/types/post";
import useNavigateToComment from "@/hooks/useNaivagteToComment";
import ReplyCard from "./ReplyCard";
import { cn } from "@/lib/utils";

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
  return (
    <div
      className={cn(
        "flex items-stretch gap-2 hover:bg-gray-50 hover:cursor-pointer",
        className
      )}
      onClick={() => navigateToComment(post.author.tagName, post.id)}
    >
      {/* Post Content */}
      <ReplyCard
        comment={post}
        dbUserId={dbUserId}
        disableShowMore={true}
        enableConnectedLine={enableConnectedLine}
      />
    </div>
  );
}
