"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import AuthorHeader from "@/components/AuthorHeader";
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
import { cn } from "@/lib/utils";

interface RootCardProps {
  post: PostType;
  dbUserId: string | null;
  className?: string;
}

export default function RootCard({ post, dbUserId, className }: RootCardProps) {
  const navigateToComment = useNavigateToComment();
  return (
    <div
      className="flex items-stretch gap-2 hover:bg-gray-50 hover:cursor-pointer"
      onClick={() => navigateToComment(post.author.tagName, post.id)}
    >
      <article className={cn(" grow space-y-2 border-b", className)}>
        {/* Hover Card */}
        <div className="flex items-center gap-2">
          <AuthorHeader
            author={post.author}
            className="flex items-center gap-2"
          />

          <span className="text-sm text-muted-foreground">
            · {formatTimeOrDate(post.createdAt)}
          </span>
          {/* 如果自己是作者，則顯示編輯按鈕 */}
          {post.authorId === dbUserId && (
            <EditButton postId={post.id} className="relative ml-auto" />
          )}
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
      </article>
    </div>
  );
}
