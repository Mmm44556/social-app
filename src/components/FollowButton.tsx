"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toggleFollow } from "@/app/actions/user.action";

export default function FollowButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const handleFollow = async () => {
    try {
      setIsLoading(true);
      await toggleFollow(userId);
    } catch (error) {
      console.error("Failed to Follow", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button onClick={handleFollow} disabled={isLoading}>
      {isLoading ? "Loading..." : "Follow"}
    </Button>
  );
}
