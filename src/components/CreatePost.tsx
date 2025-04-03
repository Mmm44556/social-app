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
import { createPost } from "@/app/actions/post.action";
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
  if (!user) return null;
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const handleSubmit = async () => {
    if (content.trim().length === 0 && !imageUrl) return;
    try {
      setIsPosting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const result = await createPost({
        content,
        imageUrl,
      });
      // 如果成功，則清空內容和圖片
      if (result.success) {
        setContent("");
        setImageUrl("");
        setShowImage(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <Card className="p-2 gap-0 rounded-lg ">
      <CardContent className="grid auto-rows-max gap-1 h-full px-0 divide-y divide-gray-200">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-1 w-full">
            <Avatar>
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
                <Image src={imageUrl} alt="Uploaded" fill />
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
        <div className="flex items-center justify-between gap-2 ">
          <div>
            {utilsItems.map((item, idx) => (
              <Button variant="utils" className="rounded-full" key={idx}>
                {item.icon}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
