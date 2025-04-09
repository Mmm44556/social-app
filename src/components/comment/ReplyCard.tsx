"use client";
import { memo } from "react";
import AuthorHeader from "@/components/AuthorHeader";
import EditButton from "@/components/EditButton";
import useNavigateToComment from "@/hooks/useNaivagteToComment";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import type { PostType } from "@/types/post";
import { cn } from "@/lib/utils";
import PostCard from "./PostCard";
interface ReplyCardProps {
  comment: PostType;
  dbUserId: string | null;
  className?: string;
  disableShowMore?: boolean;
}
function ReplyCard({
  comment,
  dbUserId,
  className,
  disableShowMore = false,
}: ReplyCardProps) {
  const navigateToComment = useNavigateToComment();
  return (
    <article
      onClick={() => {
        navigateToComment(comment.author.tagName, comment.id);
      }}
      className={cn(
        "flex items-stretch gap-2 relative hover:bg-gray-50 hover:cursor-pointer",
        className
      )}
    >
      <div className="basis-full relative">
        {/* Hover Card */}
        <div className="flex items-center gap-2">
          <AuthorHeader
            author={comment.author}
            className="flex items-center gap-2"
          />

          <span className="text-sm text-muted-foreground">
            · {formatTimeOrDate(comment.createdAt)}
          </span>
        </div>
        {/* Post Content */}
        <PostCard.PostContent
          content={comment.content}
          images={comment.images}
          disableShowMore={disableShowMore}
        />
        {/* Post Footer */}
        <PostCard.PostFooter comment={comment} dbUserId={dbUserId} />

        {/* 如果自己是作者，則顯示編輯按鈕 */}
        <EditButton comment={comment} authorId={comment.authorId} />
      </div>
    </article>
  );
}
export default memo(ReplyCard);
