"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import CommentDialog from "@/components/CommentDialog";
import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import AuthorHeader from "@/components/AuthorHeader";
import EditButton from "@/components/EditButton";
import type { PostType } from "@/types/post";
import { cn } from "@/lib/utils";
import { memo, useState } from "react";
import MediaCarousel from "@/components/MediaCarousel";

interface PostProps {
  comment: PostType;
  dbUserId: string | null;
  className?: string;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  enableConnectedLine?: boolean;
  onEvent?: (event: "like" | "comment" | "share" | "delete") => void;
  pathToRevalidate?: string;
  showFooter?: boolean;
}

function PostCard({
  comment,
  dbUserId,
  className,
  containerClassName,
  headerClassName,
  contentClassName,
  footerClassName,
  enableConnectedLine = false,
  onEvent,
  pathToRevalidate,
  showFooter = true,
}: PostProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  const handleCardClick = async (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    // 如果有選取文字，不觸發跳轉
    const selectedText = window.getSelection()?.toString();
    if (selectedText || isDragging || target.tagName === "BUTTON") {
      return;
    }

    await router.push(`/${comment.author.tagName}/post/${comment.id}`);
    router.refresh();
  };
  return (
    <Card
      className={cn(
        "rounded-xl shadow-none border p-6 hover:bg-gray-50 hover:cursor-pointer hover:shadow-sm transition-colors duration-200",
        className
      )}
    >
      <CardContent
        className="px-0 relative group"
        onClick={handleCardClick}
        onMouseDown={() => setIsDragging(false)}
        onMouseUp={() => setIsDragging(false)}
        onMouseMove={() => setIsDragging(true)}
      >
        <div
          className={cn(
            "grid grid-cols-[40px_1fr] items-stretch gap-0",
            containerClassName
          )}
        >
          {/* Hover Card */}
          <div
            className={cn(
              "flex items-center gap-2 col-span-2",
              headerClassName
            )}
          >
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

            <PostContent
              images={comment.images}
              content={comment.content}
              contentClassName={contentClassName}
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
            <PostFooter
              comment={comment}
              dbUserId={dbUserId}
              footerClassName={footerClassName}
              onEvent={onEvent}
              showFooter={showFooter}
            />
          </div>
        </div>

        <EditButton
          comment={comment}
          authorId={dbUserId ?? ""}
          pathToRevalidate={pathToRevalidate}
          onEvent={onEvent}
        />
      </CardContent>
    </Card>
  );
}

interface PostContentProps {
  images: string[];
  content: string;
  contentClassName?: string;
  disableShowMore?: boolean;
}

const PostContent = memo(
  ({
    images,
    content,
    contentClassName,
    disableShowMore = false,
  }: PostContentProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentLimit = 100; // Set the character limit for content
    const isContentLong = disableShowMore
      ? false
      : content.length > contentLimit;
    const flushEmptyImages = images.filter((image) => image !== "");

    const toggleContent = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsExpanded(!isExpanded);
    };

    return (
      <div className={cn("flex gap-2", contentClassName)}>
        {/* Post Content */}

        <div className="col-start-2">
          <p
            className={cn(
              `${!isExpanded && isContentLong ? "line-clamp-3" : ""}`,
              disableShowMore ? "" : ""
            )}
          >
            {disableShowMore
              ? content
              : isExpanded
              ? content
              : `${content.slice(0, contentLimit)}${
                  isContentLong ? "..." : ""
                }`}
          </p>
          {isContentLong && !disableShowMore && (
            <button
              onClick={toggleContent}
              className="text-ocean-blue cursor-pointer hover:underline"
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          )}

          {/* Post Images */}
          {flushEmptyImages.length > 0 && (
            <div className="mt-3 flex gap-3">
              {flushEmptyImages.map((image, index) => (
                <div key={index} className="aspect-video rounded-lg bg-muted" />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

PostContent.displayName = "PostContent";

interface PostFooterProps {
  comment: PostType;
  dbUserId: string | null;
  footerClassName?: string;
  onEvent?: (event: "like" | "comment" | "share") => void;
  showFooter?: boolean;
}

const PostFooter = memo(
  ({
    comment,
    dbUserId,
    footerClassName,
    onEvent,
    showFooter = true,
  }: PostFooterProps) => {
    return showFooter ? (
      <div className={cn("flex gap-2 mt-2", footerClassName)}>
        <div className="col-start-2 gap-3 flex items-center">
          {/* Like Button */}
          <LikeButton comment={comment} dbUserId={dbUserId} onEvent={onEvent} />

          {/* Comment Button */}
          <CommentDialog comment={comment} onEvent={onEvent} />

          {/* Share Button */}
          <ShareButton comment={comment} onEvent={onEvent} />
        </div>
      </div>
    ) : null;
  }
);

PostFooter.displayName = "PostFooter";

PostCard.PostContent = PostContent;
PostCard.PostFooter = PostFooter;
export default PostCard;
