"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  getUserByClerkId,
  getUserFollowers,
  toggleFollow,
} from "@/app/actions/user.action";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface FollowButtonProps {
  postUserId: string;
  dbUserId?: string | null;
  className?: string;
}
export default function FollowButton({
  postUserId,
  className,
  ...props
}: FollowButtonProps &
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>) {
  const clerkUser = useUser();

  const {
    data: isFollowing,
    refetch,
    isSuccess,
  } = useQuery({
    queryKey: ["isFollowing", postUserId, clerkUser?.user?.id],
    queryFn: async () => {
      if (!clerkUser?.user?.id) return;
      // 取得當前用戶
      const currentUser = await getUserByClerkId(clerkUser.user.id);
      if (!currentUser) return null;
      if (currentUser.id === postUserId) return null;
      // 取得當前用戶的followers
      const res = await getUserFollowers(currentUser.id);
      // 將followers的id存入currentUserFollowers
      const currentUserFollowers =
        res?.following.map((follower) => follower.followingId) ?? [];
      // 判斷當前用戶是否追蹤postUserId
      return currentUserFollowers.includes(postUserId);
    },
    enabled: !!clerkUser?.user?.id,
    staleTime: 30000,
  });

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clerkUser?.user?.id) return;

    try {
      await toggleFollow(postUserId);
      refetch();
    } catch (error) {
      console.error("Failed to Follow", error);
    }
  };

  if (isFollowing === null) return null;
  return isSuccess ? (
    <Button
      onClick={handleFollow}
      disabled={!clerkUser?.user?.id}
      className={cn(
        className,
        "data-[state=false]:opacity-0 data-[state=true]:opacity-100 transition-opacity duration-100"
      )}
      data-state={isFollowing === null ? false : true}
      variant={isFollowing ? "outline" : "default"}
      {...props}
    >
      {isFollowing === null
        ? "Loading..."
        : isFollowing
        ? "Unfollow"
        : "Follow"}
    </Button>
  ) : null;
}
