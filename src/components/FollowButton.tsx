"use client";

import { useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  getUserByClerkId,
  getUserFollowers,
  toggleFollow,
} from "@/app/actions/user.action";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
interface FollowButtonProps {
  postUserId: string;
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
    data: isFollowing = null,
    refetch,
    isRefetching,
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

  const deferredQuery = useDeferredValue(isFollowing ? "Unfollow" : "Follow");
  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clerkUser?.user?.id || isRefetching) return;
    try {
      await toggleFollow(postUserId);
      refetch();
    } catch (error) {
      console.error("Failed to Follow", error);
    }
  };
  //代表是自身用戶
  if (isFollowing === null) return null;
  return (
    <>
      <Button
        onClick={handleFollow}
        disabled={!clerkUser?.user?.id}
        className={cn(
          className,
          " transition-opacity duration-100 w-20 max-lg:min-w-18"
        )}
        variant={
          isRefetching
            ? deferredQuery
              ? "outline"
              : "default"
            : isFollowing
            ? "outline"
            : "default"
        }
        {...props}
      >
        {isRefetching ? (
          <Icons.loading className="h-4 w-4 animate-spin" />
        ) : isFollowing ? (
          "Unfollow"
        ) : (
          "Follow"
        )}
      </Button>
    </>
  );
}
