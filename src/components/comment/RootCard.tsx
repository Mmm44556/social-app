"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AuthorHeader } from "@/components/comment/PostCard";
import { User } from "lucide-react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import FollowButton from "@/components/FollowButton";
import LikeButton from "@/components/LikeButton";
import CommentDialog from "@/components/CommentDialog";
import ShareButton from "@/components/ShareButton";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import EditButton from "@/components/EditButton";
import type { PostType } from "@/types/post";
import useNavigateToComment from "@/hooks/useNaivagteToComment";

interface RootCardProps {
  post: PostType;
  dbUserId: string | null;
}

export default function RootCard({ post, dbUserId }: RootCardProps) {
  const navigateToComment = useNavigateToComment();
  return (
    <div className="p-3">
      <HoverCard openDelay={250}>
        <div
          className="flex items-stretch gap-2"
          onClick={() => navigateToComment(post.author.tagName, post.id)}
        >
          <div className="grow space-y-2  border-b">
            {/* Hover Card */}
            <div className="flex items-center gap-2">
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.imageUrl ?? ""} />
                    <AvatarFallback>
                      {post.author.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <AuthorHeader
                    post={post}
                    className="flex items-center gap-2"
                  />
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex gap-2 items-center">
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarImage src={post.author.imageUrl ?? ""} />
                    <AvatarFallback>
                      {post.author.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1 basis-full">
                    <h4 className="flex items-center justify-between text-sm font-semibold">
                      <AuthorHeader post={post} className="text-sm" />
                      <FollowButton
                        postUserId={post.authorId}
                        className="text-xs px-2 h-7"
                        size="sm"
                      />
                    </h4>

                    <div className="flex items-center pt-2">
                      <User className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        {post.author._count.followers} followers
                      </span>
                    </div>
                    {post.author.bio && (
                      <div className="flex items-center pt-2">
                        <span className="text-xs text-muted-foreground">
                          {post.author.bio}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center pt-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                      <span className="text-xs text-muted-foreground">
                        Joined {format(post.author.createdAt, "dd/MM/yyyy")}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>

              <span className="text-sm text-muted-foreground">
                · {formatTimeOrDate(post.createdAt)}
              </span>
            </div>

            {/* Post Content */}
            <p>{post.content}</p>

            {/* Post Images */}
            {/* {flushEmptyImages.length > 0 && (
            <div className="mt-3 flex gap-3">
              {flushEmptyImages.map((image) => (
                <div className="aspect-video rounded-lg bg-muted" />
              ))}
            </div>
          )} */}

            <div className="flex items-center gap-3">
              <LikeButton post={post} dbUserId={dbUserId} />
              <CommentDialog post={post} />
              <ShareButton post={post} />
            </div>
          </div>

          {/* 如果自己是作者，則顯示編輯按鈕 */}
          {post.authorId === dbUserId && <EditButton postId={post.id} />}
        </div>
      </HoverCard>
    </div>
  );
}
