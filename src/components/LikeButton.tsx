"use client";
import { startTransition, useOptimistic } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/actions/post.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import { SignInButton } from "@clerk/nextjs";

interface LikeButtonProps {
  post: Post;
  dbUserId: string | null;
}
export default function LikeButton({ post, dbUserId }: LikeButtonProps) {
  const [optimisticData, addOptimisticData] = useOptimistic(
    {
      likesCount: post._count.likes,
      hasLiked: post.likes.some((like) => like.userId === dbUserId),
    },
    (state, optimisticUpdate: { likesCount: number; hasLiked: boolean }) => ({
      ...state,
      ...optimisticUpdate,
    })
  );
  const getLikeCount = () =>
    optimisticData.likesCount > 0 ? optimisticData.likesCount : "Like";

  if (!dbUserId)
    return (
      <SignInButton mode="modal">
        <Button variant="ghost" size="none">
          <Heart
            className={cn(
              "size-4",
              optimisticData.hasLiked && "fill-red-500 text-red-500"
            )}
          />

          {getLikeCount()}
        </Button>
      </SignInButton>
    );

  const handleLike = async () => {
    try {
      const newHasLiked = !optimisticData.hasLiked;
      const newLikesCount = optimisticData.likesCount + (newHasLiked ? 1 : -1);

      startTransition(() => {
        addOptimisticData({
          likesCount: newLikesCount,
          hasLiked: newHasLiked,
        });
      });

      await toggleLike(post.id);
    } catch (error) {
      console.error(error);
      startTransition(() => {
        addOptimisticData({
          likesCount: post._count.likes,
          hasLiked: post.likes.some((like) => like.userId === dbUserId),
        });
      });
    }
  };
  return (
    <Button variant="ghost" size="none" onClick={handleLike}>
      <Heart
        className={cn(
          "size-4",
          optimisticData.hasLiked && "fill-red-500 text-red-500"
        )}
      />

      {getLikeCount()}
    </Button>
  );
}
