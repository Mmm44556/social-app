"use client";

import type React from "react";
import { useState, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
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
import type { PostType, ReplyType, ContentType } from "@/types/post";
import CommentUtilsBar from "@/components/CommentUtilsBar";
import { SignInButton, useUser } from "@clerk/nextjs";
import Post from "./comment/PostCard";
import { Icons } from "./ui/icons";

import { createReply } from "@/app/actions/test";
interface CommentDialogProps {
  children?: React.ReactNode;
  className?: string;
  post: PostType;
}

export default function CommentDialog({ post, className }: CommentDialogProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [hasComment, setHasComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // 如果沒有登入，則顯示登入按鈕
  if (!user) {
    return (
      <SignInButton mode="modal">
        <Button
          variant="ghost"
          size="none"
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          <Icons.comment className="size-4" />
          {post.replyCount}
        </Button>
      </SignInButton>
    );
  }
  const handleComment = async () => {
    if (comment.trim().length === 0 || isCommenting) return;

    try {
      setIsCommenting(true);
      const newComment = await createReply({
        parentId: post.id,
        content: comment.trim(),
        images: [],
      });

      if (newComment.success) {
        setComment("");
        setIsCommenting(false);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (comment.trim().length > 0) {
        setHasComment(true);
      } else {
        setHasComment(false);
        setComment("");
        setOpen(false);
      }
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="none"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className={className}
          >
            <Icons.comment className="size-4" />
            {post.replyCount}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[550px]"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Comment</DialogTitle>
            <DialogDescription>Comment on the post</DialogDescription>
          </DialogHeader>
          {/* Post */}
          <Post post={post} dbUserId={user.id} />

          {/* Comment Input */}
          <div className="mt-4 flex gap-3 px-6">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={user.imageUrl ?? ""}
                alt={user.username ?? ""}
                onLoad={() => setIsLoading(false)}
                data-state={isLoading ? "loading" : "idle"}
                className="transition-all duration-300 hover:scale-110 data-[state=loading]:opacity-0 data-[state=idle]:opacity-100"
              />
              <AvatarFallback>
                {user.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="rounded-md border bg-muted/40 focus-within:ring-1 focus-within:ring-ring">
                <Textarea
                  placeholder="Write your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border-0 bg-transparent focus-visible:ring-0"
                />
              </div>

              {/* Formatting toolbar */}
              <CommentUtilsBar />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleComment}
              disabled={isCommenting || comment.trim().length === 0}
              className="gap-2"
            >
              {isCommenting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Post Comment</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CommentDiscardDialog
        hasComment={hasComment}
        setHasComment={setHasComment}
        onDiscard={() => {
          setOpen(false);
          setHasComment(false);
          setComment("");
        }}
      />
    </>
  );
}

interface CommentDiscardDialogProps {
  hasComment: boolean;
  onDiscard: () => void;
  setHasComment: React.Dispatch<React.SetStateAction<boolean>>;
}
const CommentDiscardDialog = memo(
  ({ hasComment, onDiscard, setHasComment }: CommentDiscardDialogProps) => {
    return (
      <Dialog open={hasComment} onOpenChange={setHasComment}>
        <DialogContent className="sm:max-w-md" showClose={false}>
          <DialogHeader>
            <DialogTitle>Discard Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard your comment?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="alert" onClick={onDiscard}>
                Yes
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);
