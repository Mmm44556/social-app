"use client";

import type React from "react";
import { useState, memo, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import type { PostType } from "@/types/post";
import CommentUtilsBar from "@/components/CommentUtilsBar";
import { SignInButton } from "@clerk/nextjs";
import Post from "@/components/comment/PostCard";
import { Icons } from "@/components/ui/icons";
import { upload } from "@vercel/blob/client";
import { createReply } from "@/app/actions/comment.action";
import MediaCarousel from "./MediaCarousel";
import { useRouter } from "next/navigation";
import { useCreateEditor } from "@/hooks/useCreateEditor";
import { EditorContent } from "@tiptap/react";
import { useGetDbUser } from "@/hooks/useGetDbUser";
interface CommentDialogProps {
  children?: React.ReactNode;
  className?: string;
  comment: PostType;
  onEvent?: (event: "comment") => void;
}

export default function CommentDialog({
  comment,
  className,
  onEvent,
}: CommentDialogProps) {
  const router = useRouter();
  const { data: dbUser } = useGetDbUser();
  const [open, setOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const editor = useCreateEditor(commentText, setCommentText);
  const [isCommenting, setIsCommenting] = useState(false);
  const [hasComment, setHasComment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<Array<{ url: string; file: File }> | []>(
    []
  );
  const inputFileRef = useRef<HTMLInputElement>(null);
  // 如果沒有登入，則顯示登入按鈕
  if (!dbUser) {
    return (
      <SignInButton mode="modal">
        <Button
          variant="ghost"
          size="none"
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          <Icons.comment className="size-5" />
          {comment.replyCount}
        </Button>
      </SignInButton>
    );
  }
  const handleComment = async () => {
    if ((commentText.trim().length === 0 && !images.length) || isCommenting)
      return;
    try {
      setIsCommenting(true);
      const newComment = await createReply({
        parentId: comment.id,
        content: commentText.trim(),
      });

      if (newComment.success) {
        onEvent?.("comment");
        setCommentText("");

        if (images.length > 0) {
          // 先上傳圖片
          const uploadResults = await Promise.allSettled(
            images.map(async (image) => {
              const uploadResult = await upload(
                `comments/${comment.id}/${newComment.reply?.id}/${image.file.name}`,
                image.file,
                {
                  access: "public",
                  handleUploadUrl: "/api/image",
                  clientPayload: newComment.reply?.id,
                }
              );
              URL.revokeObjectURL(image.url);
              return uploadResult;
            })
          );

          // 檢查所有圖片是否都上傳成功
          const allUploadsSuccessful = uploadResults.every(
            (result) => result.status === "fulfilled"
          );

          if (allUploadsSuccessful) {
            // 清空內容和圖片
            setImages([]);
            if (inputFileRef.current) {
              inputFileRef.current.value = "";
            }
            setIsCommenting(false);
            setOpen(false);
          }
        } else {
          setIsCommenting(false);
          setOpen(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCommenting(false);
      const timer = setTimeout(() => {
        router.refresh();
        clearTimeout(timer);
      }, 1000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (commentText.trim().length > 0 || images.length > 0) {
        setHasComment(true);
      } else {
        setHasComment(false);
        setCommentText("");
        editor?.commands.clearContent();
        setOpen(false);
        setImages((prev) => {
          prev.forEach((image) => {
            URL.revokeObjectURL(image.url);
          });
          return [];
        });
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
            <Icons.comment className="size-5" />
            {comment.replyCount}
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[550px] max-h-[85dvh] overflow-y-auto pt-0 gap-2 max-lg:mt-10 max-md:p-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
          showClose={false}
        >
          <DialogHeader className="sticky top-0 mt-5 p-1 bg-white z-50">
            <DialogTitle>Comment</DialogTitle>
            <DialogDescription>Comment on the post</DialogDescription>
          </DialogHeader>
          {/* Post */}
          <Post
            comment={comment}
            dbUserId={dbUser?.id}
            className="p-4 max-lg:m-2"
            showFooter={false}
            contentContainerClassName="max-lg:p-2"
          />

          {/* Comment Input */}
          <div className="mt-4 flex gap-3 px-6">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={dbUser?.avatarUrl ?? ""}
                alt={dbUser?.username ?? ""}
                onLoad={() => setIsLoading(false)}
                data-state={isLoading ? "loading" : "idle"}
                className="transition-all duration-300 hover:scale-110 data-[state=loading]:opacity-0 data-[state=idle]:opacity-100"
              />
              <AvatarFallback>
                {dbUser?.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="rounded-md border bg-muted/40 focus-within:ring-1 focus-within:ring-ring">
                <EditorContent
                  editor={editor}
                  className="min-h-14 border-0 bg-transparent focus-visible:ring-0 px-2"
                  placeholder="Write your comment..."
                />
              </div>

              {images.length > 0 && (
                <MediaCarousel
                  urls={images}
                  onDelete={(image) => {
                    URL.revokeObjectURL(image.url);
                    setImages((prev) => {
                      const newImages = prev.filter((i) => i.url !== image.url);
                      return newImages;
                    });
                  }}
                  className="group"
                  itemClassName="justify-center"
                  previousButtonClassName="left-0"
                  nextButtonClassName="right-0"
                />
              )}

              {/* Formatting toolbar */}
              <CommentUtilsBar
                setImages={setImages}
                inputFileRef={inputFileRef}
                editor={editor}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleComment}
              disabled={
                isCommenting ||
                (commentText.trim().length === 0 && images.length === 0)
              }
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
          setCommentText("");
          editor?.commands.clearContent();
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
            <DialogTitle>Discard comment?</DialogTitle>
            <DialogDescription>
              Are you sure you want to discard your comment? This action cannot
              be undone.
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

CommentDiscardDialog.displayName = "CommentDiscardDialog";
