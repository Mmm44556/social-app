"use client";

import NoData from "./NoData";
import { TabComponentProps } from "@/app/(user)/[userTagName]/page";
import useInfiniteScrollLikes from "@/hooks/useInfiniteScrollLikes";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostCard from "@/components/comment/PostCard";
import { LoaderCircle } from "lucide-react";

export default function Likes({ tagName, dbUserId }: TabComponentProps) {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteScrollLikes({
    tagName,
    limit: 10,
    queryKey: ["likes", tagName],
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <LoaderCircle className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  const allLikes = data?.pages.flatMap((page) => page) ?? [];

  if (allLikes.length === 0) {
    return (
      <NoData
        title="No likes yet"
        description="When you like a post, it will show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {allLikes.map((post) => (
        <PostCard
          key={post.id}
          comment={post}
          dbUserId={dbUserId}
          className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-4 py-3"
          onEvent={() => refetch()}
        />
      ))}
      <div ref={ref} className="flex items-center justify-center p-4">
        {isFetchingNextPage && (
          <LoaderCircle className="w-6 h-6 animate-spin" />
        )}
      </div>
    </div>
  );
}
