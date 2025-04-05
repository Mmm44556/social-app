"use client";
import LikeButton from "./LikeButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthorHeader } from "./PostCard";
import FollowButton from "./FollowButton";
import { CalendarDays, User } from "lucide-react";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import EditButton from "./EditButton";
import { HoverCardTrigger, HoverCardContent } from "./ui/hover-card";
import { HoverCard } from "./ui/hover-card";
import CommentDialog from "./CommentDialog";
import ShareButton from "./ShareButton";
import { format } from "date-fns";
import { memo } from "react";
import { useRouter } from "next/navigation";
interface ReplyCardProps {
  comment: any;
  dbUserId: string | null;
}
function ReplyCard({ comment, dbUserId }: ReplyCardProps) {
  const router = useRouter();
  // console.log(comment);
  const handleCardClick = async (e: React.MouseEvent) => {
    // // 如果有選取文字，不觸發跳轉
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      return;
    }
    router.push(`/${comment.author.tagName}/post/${comment.id}`);
  };

  return (
    <>
      <HoverCard openDelay={250}>
        <div
          className="flex items-stretch gap-2 relative"
          onClick={handleCardClick}
        >
          <HoverCardTrigger asChild>
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author?.imageUrl ?? ""} />
              <AvatarFallback>
                {comment.author?.username?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </HoverCardTrigger>

          <div className="basis-full">
            {/* Hover Card */}
            <div className="flex items-center gap-2">
              <HoverCardTrigger asChild>
                <AuthorHeader
                  post={comment}
                  className="flex items-center gap-2"
                />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex gap-2 items-center">
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src={comment.author.imageUrl ?? ""} />
                    <AvatarFallback>
                      {comment.author?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 basis-full">
                    <h4 className="flex items-center justify-between text-sm font-semibold">
                      <AuthorHeader post={comment} className="text-sm" />
                      <FollowButton
                        postUserId={comment.authorId}
                        className="text-xs px-2 h-7"
                        size="sm"
                      />
                    </h4>

                    <div className="flex items-center pt-2">
                      <User className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        {comment.author._count.followers} followers
                      </span>
                    </div>
                    {comment.author.bio && (
                      <div className="flex items-center pt-2">
                        <span className="text-xs text-muted-foreground">
                          {comment.author.bio}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        Joined {format(comment.author.createdAt, "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>

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
          </div>

          {comment.authorId === dbUserId && <EditButton postId={comment.id} />}
        </div>
      </HoverCard>
    </>
  );
}
export default memo(ReplyCard);
