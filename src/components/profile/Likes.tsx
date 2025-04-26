"use client";

import NoData from "./NoData";
import { TabComponentProps } from "@/app/(user)/[userTagName]/page";
import useInfiniteScrollLikes from "@/hooks/useInfiniteScrollLikes";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostCard from "@/components/comment/PostCard";
import { SkeletonList } from "../CustomSkeletons";

export default function Likes({ tagName, dbUserId }: TabComponentProps) {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetched,
    isLoading,
    refetch,
  } = useInfiniteScrollLikes({
    tagName,
    queryKey: ["likes", tagName],
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allLikes = data?.pages.flatMap((page) => page) ?? [];

  if (allLikes.length === 0 && isFetched) {
    return (
      <NoData
        title="No likes yet"
        description="When you like a post, it will show up here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <SkeletonList length={5} />}

      {allLikes.map((post) => (
        <PostCard
          key={post.id}
          comment={post}
          dbUserId={dbUserId}
          className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-4 py-3"
          onEvent={() => refetch()}
        />
      ))}
      <div ref={ref}>{isFetchingNextPage && <SkeletonList length={5} />}</div>
    </div>
  );
}
