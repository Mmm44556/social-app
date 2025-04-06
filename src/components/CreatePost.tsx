"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Send, SmilePlusIcon, Sparkles } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createPost } from "@/app/actions/comment.action";
import CommentUtilsBar from "./CommentUtilsBar";
const utilsItems = [
  {
    icon: <ImageIcon />,
  },
  {
    icon: <Sparkles />,
  },
  {
    icon: <SmilePlusIcon />,
  },
];
export default function CreatePost() {
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [showImage, setShowImage] = useState(false);
  if (!user) return null;
  const handleSubmit = async () => {
    if (content.trim().length === 0 && !imageUrl) return;
    try {
      setIsPosting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await createPost({
        content,
        imagesUrl: imageUrl,
      });
      // 如果成功，則清空內容和圖片
      if (result.success) {
        setContent("");
        setImageUrl([]);
        setShowImage(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <Card className="p-2 gap-0 rounded-lg min-h-32">
      <CardContent className="grid gap-1 grow h-full px-0 divide-y divide-gray-200">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1 w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Write a something..."
              className="w-full rounded-none shadow-none placeholder:text-gray-400 h-full border-0 selection:bg-gray-300/50"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {/* Image Preview */}

            {showImage && (
              <div className="relative w-full h-40">
                <Image src={imageUrl[0]} alt="Uploaded" fill />
              </div>
            )}
          </div>
          <div>
            <Button
              onClick={handleSubmit}
              disabled={isPosting || content.trim().length === 0}
              variant="utils"
              className={cn(
                "rounded-full",
                isPosting ? "animate-spin-fly" : "hover:animate-smaill-rotate"
              )}
            >
              <Send className="size-5 stroke-theme" />
            </Button>
          </div>
        </div>

        {/* Comment Utils Bar */}
        <CommentUtilsBar />
      </CardContent>
    </Card>
  );
}
