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
  enableConnectedLine?: boolean;
}
function ReplyCard({
  comment,
  dbUserId,
  className,
  disableShowMore = false,
  enableConnectedLine = false,
}: ReplyCardProps) {
  const navigateToComment = useNavigateToComment();
  return (
    <article
      onClick={() => {
        navigateToComment(comment.author.tagName, comment.id);
      }}
      className={cn(
        "flex items-stretch gap-2 grow relative hover:bg-gray-50 hover:cursor-pointer",
        className
      )}
    >
      <div className="basis-full relative">
        <div className="grid grid-cols-[40px_1fr] items-stretch gap-0 px-0">
          {/* Hover Card */}
          <div className="flex items-center gap-2 col-span-2">
            <AuthorHeader
              author={comment.author}
              className="flex items-center gap-2"
            />

            <span className="text-sm text-muted-foreground">
              · {formatTimeOrDate(comment.createdAt)}
            </span>
          </div>

          {/* 連接線 */}
          {enableConnectedLine && (
            <div className="flex items-center justify-center">
              <div className="w-[2px] h-full bg-gray-200"></div>
            </div>
          )}

          <div className={cn("py-2", enableConnectedLine ? "" : "col-start-2")}>
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
        </div>
      </div>
    </article>
  );
}
export default memo(ReplyCard);
