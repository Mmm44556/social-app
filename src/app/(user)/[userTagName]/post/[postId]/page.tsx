import { AuthorHeader } from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import { format } from "date-fns";
import FollowButton from "@/components/FollowButton";
import CommentDialog from "@/components/CommentDialog";
import { getDbUserId } from "@/app/actions/user.action";
import ShareButton from "@/components/ShareButton";
import { getContent } from "@/app/actions/test";
import ReplyCard from "@/components/ReplyCard";
import MainHeader from "@/components/MainHeader";
interface PostPageProps {
  params: Promise<{ userTagName: string; postId: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId, userTagName } = await params;
  const post = await getContent(postId);
  const dbUserId = await getDbUserId();
  if (!post) return null;
  return (
    <>
      {/* Header */}
      <MainHeader />

      {/* Post */}
      <div className="p-3">
        <HoverCard openDelay={250}>
          <div className="flex items-stretch gap-2">
            <div className="grow space-y-2  border-b">
              {/* Hover Card */}
              <div className="flex items-center gap-2">
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.content.author.imageUrl ?? ""} />
                      <AvatarFallback>
                        {post.content.author?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <AuthorHeader
                      post={post.content}
                      className="flex items-center gap-2"
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex gap-2 items-center">
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarImage src={post.content.author.imageUrl ?? ""} />
                      <AvatarFallback>
                        {post.content.author?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 basis-full">
                      <h4 className="flex items-center justify-between text-sm font-semibold">
                        <AuthorHeader post={post.content} className="text-sm" />
                        <FollowButton
                          postUserId={post.content.authorId}
                          className="text-xs px-2 h-7"
                          size="sm"
                        />
                      </h4>

                      <div className="flex items-center pt-2">
                        <User className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          {post.content.author._count.followers} followers
                        </span>
                      </div>
                      {post.content.author.bio && (
                        <div className="flex items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            {post.content.author.bio}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          Joined{" "}
                          {format(post.content.author.createdAt, "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>

                <span className="text-sm text-muted-foreground">
                  · {formatTimeOrDate(post.content.createdAt)}
                </span>
              </div>

              {/* Post Content */}
              <p>{post.content.content}</p>

              {/* Post Images */}
              {/* {flushEmptyImages.length > 0 && (
                  <div className="mt-3 flex gap-3">
                    {flushEmptyImages.map((image) => (
                      <div className="aspect-video rounded-lg bg-muted" />
                    ))}
                  </div>
                )} */}

              <div className="flex items-center gap-3">
                <LikeButton post={post.content} dbUserId={dbUserId} />
                <CommentDialog post={post.content} />
                <ShareButton post={post.content} />
              </div>
            </div>
          </div>
        </HoverCard>
      </div>

      {/* Replies */}
      <div className="space-y-2 px-3">
        <div className="pt-0">
          <span className="text-md text-muted-foreground">Replies</span>
        </div>

        <div className="space-y-8">
          {post.replies &&
            post.replies.map((comment) => (
              <ReplyCard
                key={comment.id}
                comment={comment}
                dbUserId={dbUserId}
              />
            ))}
        </div>
      </div>
    </>
  );
}
