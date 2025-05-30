"use client";
import { memo, useState } from "react";
import AuthorHeader from "@/components/AuthorHeader";
import EditButton from "@/components/EditButton";
import useNavigateToComment from "@/hooks/useNaivagteToComment";
import formatTimeOrDate from "@/lib/utils/formatTimeOrDate";
import type { PostType } from "@/types/post";
import { cn } from "@/lib/utils";
import PostCard from "./PostCard";
import MediaCarousel from "@/components/MediaCarousel";
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
  const [isDragging, setIsDragging] = useState(false);
  return (
    <article
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "BUTTON" || isDragging) return;
        navigateToComment(comment.author.tagName, comment.id);
      }}
      className={cn(
        "group  flex items-stretch gap-2 grow relative hover:bg-gray-50 hover:cursor-pointer",
        className
      )}
      onMouseDown={() => setIsDragging(false)}
      onMouseUp={() => setIsDragging(false)}
      onMouseMove={() => setIsDragging(true)}
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
            {/* Post Images */}
            {comment.images.length > 0 && (
              <MediaCarousel
                urls={comment.images.map((image) => ({
                  url: image,
                  file: undefined,
                }))}
              />
            )}
            {/* Post Footer */}
            <PostCard.PostFooter comment={comment} dbUserId={dbUserId} />
            {/* 如果自己是作者，則顯示編輯按鈕 */}
            <EditButton comment={comment} authorId={dbUserId ?? ""} />
          </div>
        </div>
      </div>
    </article>
  );
}
export default memo(ReplyCard);
