"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { upload } from "@vercel/blob/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createComment } from "@/app/actions/comment.action";
import CommentUtilsBar from "./CommentUtilsBar";

import { useRouter } from "next/navigation";
import MediaCarousel from "./MediaCarousel";

interface CreatePostProps {
  className?: string;
}
export default function CreatePost({ className }: CreatePostProps) {
  const { user } = useUser();
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<Array<{ url: string; file: File }> | []>(
    []
  );
  const [isPosting, setIsPosting] = useState(false);
  if (!user) return null;
  const handleSubmit = async () => {
    if (content.trim().length === 0 && !images.length) return;
    try {
      setIsPosting(true);
      const result = await createComment({
        content,
      });

      if (result.success) {
        // 先上傳圖片
        const uploadResults = await Promise.allSettled(
          images.map(async (image) => {
            const uploadResult = await upload(
              `comments/${result.commentId}/${image.file.name}`,
              image.file,
              {
                access: "public",
                handleUploadUrl: "/api/image",
                clientPayload: result.commentId,
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
          setContent("");
          setImages([]);
          if (inputFileRef.current) {
            inputFileRef.current.value = "";
          }
          const timer = setTimeout(() => {
            router.refresh();
            clearTimeout(timer);
          }, 1000);
        } else {
          console.error("Some images failed to upload");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className={cn(className, "p-2 gap-0 rounded-lg min-h-32s")}>
      <CardContent className="grid gap-1 h-full px-0 divide-y divide-gray-200">
        <div>
          <div className="flex grow items-center gap-1 w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Write a something..."
              className="w-full grow rounded-none shadow-none placeholder:text-gray-400 h-full border-0 selection:bg-gray-300/50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* Image Preview */}
            <Button
              onClick={handleSubmit}
              disabled={
                isPosting ||
                (content.trim().length === 0 && images.length === 0)
              }
              variant="utils"
              className={cn(
                "rounded-full",
                isPosting ? "animate-spin-fly" : "hover:animate-smaill-rotate"
              )}
            >
              <Send className="size-5 stroke-theme" />
            </Button>
          </div>

          {/* Post Images */}
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
        </div>

        {/* Comment Utils Bar */}
        <CommentUtilsBar setImages={setImages} inputFileRef={inputFileRef} />
      </CardContent>
    </Card>
  );
}
