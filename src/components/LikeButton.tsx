"use client";
import { startTransition, useOptimistic } from "react";
import { Heart } from "lucide-react";
import { toggleLike } from "@/app/actions/comment.action";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PostType } from "@/types/post";
import { SignInButton } from "@clerk/nextjs";
import { VariantProps } from "class-variance-authority";

interface LikeButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  dbUserId: string | null;
  className?: string;
  comment: PostType;
  onEvent?: (event: "like") => void;
}

export default function LikeButton({
  comment,
  dbUserId,
  className,
  onEvent,
  ...props
}: LikeButtonProps) {
  const [optimisticData, addOptimisticData] = useOptimistic(
    {
      likesCount: comment.likeCount,
      hasLiked: comment.likes.some((like) => like.userId === dbUserId),
    },
    (state, optimisticUpdate: { likesCount: number; hasLiked: boolean }) => ({
      ...state,
      ...optimisticUpdate,
    })
  );
  const getLikeCount = () =>
    optimisticData.likesCount > 0 ? optimisticData.likesCount : 0;
  if (!dbUserId)
    return (
      <SignInButton mode="modal">
        <Button
          variant="ghost"
          size="none"
          className={className}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          <Heart
            className={cn(
              "size-5",
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
      await toggleLike(comment.id);
      onEvent?.("like");
    } catch (error) {
      console.error(error);
      startTransition(() => {
        addOptimisticData({
          likesCount: comment.likeCount,
          hasLiked: comment.likes.some((like) => like.userId === dbUserId),
        });
      });
    }
  };
  return (
    <Button
      variant="ghost"
      size="none"
      onClick={(e) => {
        e.stopPropagation();
        handleLike();
      }}
      className={className}
      {...props}
    >
      <Heart
        className={cn(
          "size-5",
          optimisticData.hasLiked && "fill-red-500 text-red-500"
        )}
      />

      {getLikeCount()}
    </Button>
  );
}
