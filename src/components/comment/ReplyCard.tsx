"use client";
import { memo } from "react";
import { format } from "date-fns";
import { CalendarDays, User } from "lucide-react";
import AuthorHeader from "@/components/AuthorHeader";
import LikeButton from "@/components/LikeButton";
import FollowButton from "@/components/FollowButton";
import CommentDialog from "@/components/CommentDialog";
import ShareButton from "@/components/ShareButton";
import EditButton from "@/components/EditButton";
import { HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard } from "@/components/ui/hover-card";
import useNavigateToComment from "@/hooks/useNaivagteToComment";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import type { PostType } from "@/types/post";
import { cn } from "@/lib/utils";
interface ReplyCardProps {
  comment: PostType;
  dbUserId: string | null;
  className?: string;
}
function ReplyCard({ comment, dbUserId, className }: ReplyCardProps) {
  const navigateToComment = useNavigateToComment();
  return (
    <article
      onClick={() => navigateToComment(comment.author.tagName, comment.id)}
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
        <p className="mt-1">{comment.content}</p>

        {/* Post Images */}
        {/* {flushEmptyImages.length > 0 && (
                <div className="mt-3 flex gap-3">
                  {flushEmptyImages.map((image) => (
                    <div className="aspect-video rounded-lg bg-muted" />
                  ))}
                </div>
              )} */}
        <div className="mt-2 flex items-center gap-3">
          {/* Like Button */}
          <LikeButton post={comment} dbUserId={dbUserId} />

          {/* Comment Button */}
          <CommentDialog post={comment} />

          {/* Share Button */}
          <ShareButton post={comment} />
        </div>

        {/* 如果自己是作者，則顯示編輯按鈕 */}
        {comment.authorId === dbUserId && <EditButton postId={comment.id} />}
      </div>
    </article>
  );
}
export default memo(ReplyCard);
