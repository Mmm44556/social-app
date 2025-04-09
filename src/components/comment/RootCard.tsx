"use client";

import AuthorHeader from "@/components/AuthorHeader";
import LikeButton from "@/components/LikeButton";
import CommentDialog from "@/components/CommentDialog";
import ShareButton from "@/components/ShareButton";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import EditButton from "@/components/EditButton";
import type { PostType } from "@/types/post";
import useNavigateToComment from "@/hooks/useNaivagteToComment";
import { cn } from "@/lib/utils";
import PostCard from "./PostCard";
import ReplyCard from "./ReplyCard";

interface RootCardProps {
  post: PostType;
  dbUserId: string | null;
  className?: string;
}

export default function RootCard({ post, dbUserId, className }: RootCardProps) {
  const navigateToComment = useNavigateToComment();
  return (
    <div
      className="flex items-stretch px-4 gap-2 hover:bg-gray-50 hover:cursor-pointer"
      onClick={() => navigateToComment(post.author.tagName, post.id)}
    >
      {/* <article className={cn(" grow space-y-2 border-b", className)}> */}
      {/* Post Content */}
      <ReplyCard comment={post} dbUserId={dbUserId} disableShowMore={true} />
      {/* 如果自己是作者，則顯示編輯按鈕 */}
      <EditButton
        comment={post}
        authorId={dbUserId ?? ""}
        className="relative ml-auto"
      />
      {/* </article> */}
    </div>
  );
}
