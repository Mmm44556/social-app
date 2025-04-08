"use client";

import { useState } from "react";
import { EllipsisIcon, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import { deleteComment } from "@/app/actions/comment.action";
import { PostType } from "@/types/post";
import CommentDialog from "@/components/CommentDialog";
import LikeButton from "@/components/LikeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DeleteDialog from "@/components/DeleteDialog";
import { useRouter } from "next/navigation";
import ShareButton from "@/components/ShareButton";
import AuthorHeader from "@/components/AuthorHeader";
import EditButton from "../EditButton";
interface PostProps {
  post: PostType;
  dbUserId: string | null;
}
export default function PostCard({ post, dbUserId }: PostProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const flushEmptyImages = post.images.filter((image) => image !== "");
  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteComment(post.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCardClick = async () => {
    // 如果有選取文字，不觸發跳轉
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      return;
    }

    await router.push(`/${post.author.tagName}/post/${post.id}`);
    router.refresh();
  };
  return (
    <Card className="rounded-xl shadow-none border p-6 hover:bg-gray-50 hover:cursor-pointer hover:shadow-sm transition-colors duration-200">
      <CardContent className="px-0 relative" onClick={handleCardClick}>
        <div className="flex items-stretch gap-2">
          <div className="basis-full">
            {/* Hover Card */}
            <div className="flex items-center gap-2">
              <AuthorHeader
                author={post.author}
                className="flex items-center gap-2"
              />

              <span className="text-sm text-muted-foreground">
                · {formatTimeOrDate(post.createdAt)}
              </span>
            </div>

            {/* Post Content */}
            <p className="mt-1">{post.content}</p>

            {/* Post Images */}
            {flushEmptyImages.length > 0 && (
              <div className="mt-3 flex gap-3">
                {flushEmptyImages.map((image) => (
                  <div className="aspect-video rounded-lg bg-muted" />
                ))}
              </div>
            )}

            <div className="mt-3 flex items-center gap-3">
              {/* Like Button */}
              <LikeButton post={post} dbUserId={dbUserId} />

              {/* Comment Button */}
              <CommentDialog post={post} />

              {/* Share Button */}
              <ShareButton post={post} />
            </div>
          </div>
        </div>
        {post.authorId === dbUserId && <EditButton commentId={post.id} />}
      </CardContent>
    </Card>
  );
}
