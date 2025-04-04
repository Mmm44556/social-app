"use client";

import { useState } from "react";
import {
  Delete,
  EllipsisIcon,
  Link,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deletePost } from "@/app/actions/post.action";
import { Post as PostType } from "@/types/post";
import CommentDialog from "@/components/CommentDialog";
import LikeButton from "./LikeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPortal } from "react-dom";
import DeleteDialog from "./DeleteDialog";
interface PostProps {
  post: PostType;
  dbUserId: string | null;
  type?: "post" | "comment";
}
export default function Post({ post, dbUserId, type = "post" }: PostProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const flushEmptyImages = post.images.filter((image) => image !== "");

  const handleShare = async () => {
    setIsSharing(true);
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deletePost(post.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
      <Card className="mb-4 rounded-xl shadow-none border p-6">
        <CardContent className="flex gap-3 px-0 relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.imageUrl ?? ""} />
            <AvatarFallback>{post.author?.username?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{post.author.username}</span>
              <span className="text-sm text-muted-foreground">
                @{post.author.email.split("@")[0]}
              </span>
              <span className="text-sm text-muted-foreground">
                · {formatTimeOrDate(post.createdAt)}
              </span>
            </div>
            <p className="mt-1">{post.content}</p>
            {flushEmptyImages.length > 0 && (
              <div className="mt-3 aspect-video rounded-lg bg-muted" />
            )}
            {type === "post" && (
              <div className="mt-3 flex gap-3">
                {/* Like Button */}
                <LikeButton post={post} dbUserId={dbUserId} />

                {/* Comment Button */}
                <CommentDialog post={post} />

                {/* Share Button */}
                <Button variant="ghost" size="none">
                  <Share2 className="size-4 px-" />
                  Share
                </Button>
              </div>
            )}
          </div>
          {type === "post" && post.authorId === dbUserId && (
            <DropdownMenu
              onOpenChange={(e) => {
                console.log(e);
              }}
            >
              <DropdownMenuTrigger className="absolute right-0 top-0 cursor-pointer">
                <EllipsisIcon className="size-5 hover:text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="[&_div]:hover:bg-gray-100 [&_div]:hover:cursor-pointer">
                <DropdownMenuItem>
                  Copy link <Link />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Edit <Pencil />
                </DropdownMenuItem>

                <DeleteDialog
                  isDelete={isDeleteDialogOpen}
                  onDelete={handleDelete}
                >
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault();
                    }}
                  >
                    Delete <Trash2 />
                  </DropdownMenuItem>
                </DeleteDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardContent>
      </Card>
    </>
  );
}
