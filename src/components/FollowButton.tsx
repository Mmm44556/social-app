"use client";

import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
  getUserByClerkId,
  getUserFollowers,
  toggleFollow,
} from "@/app/actions/user.action";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchFollowers() {
      if (!clerkUser?.user?.id) return;
      try {
        // 取得當前用戶
        const currentUser = await getUserByClerkId(clerkUser.user.id);
        if (!currentUser) throw new Error("User not found");
        if (currentUser.id === postUserId) return;
        // 取得當前用戶的followers
        const res = await getUserFollowers(currentUser.id);
        // 將followers的id存入currentUserFollowers
        const currentUserFollowers =
          res?.following.map((follower) => follower.followingId) ?? [];
        // 判斷當前用戶是否追蹤postUserId
        setIsFollowing(currentUserFollowers.includes(postUserId));
      } catch (error) {
        console.error("Failed to fetch followers", error);
      }
    }
    if (clerkUser?.user?.id) {
      fetchFollowers();
    }
  }, [postUserId, clerkUser?.user?.id]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clerkUser?.user?.id) return;

    try {
      await toggleFollow(postUserId);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("Failed to Follow", error);
    }
  };

  return (
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
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
