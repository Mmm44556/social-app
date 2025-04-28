"use client";

import CreatePost from "@/components/CreatePost";
import { Fragment, useEffect } from "react";
import PostCard from "@/components/comment/PostCard";
import {
  DB_User,
  getDbUserId,
  getUserByClerkId,
} from "@/app/actions/user.action";
import { useInView } from "react-intersection-observer";
import { useFeed } from "@/hooks/useFeed";
import { SkeletonList } from "@/components/CustomSkeletons";
import { cn } from "@/lib/utils";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
export default function HomePage() {
  const { ref, inView } = useInView();
  const { data: user = null } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const id = await getDbUserId();
      if (!id) return null;
      return getUserByClerkId(id);
    },
  }) as UseQueryResult<DB_User>;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useFeed();
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <>
      <CreatePost dbUser={user} className="mb-10" onEvent={() => refetch()} />
      {/* Main Posts */}

      <div className={cn("border-t", !posts.length ? "border-t-0" : "")}>
        {isLoading && <SkeletonList />}
        {posts.map((post) => (
          <Fragment key={post.id}>
            <PostCard
              comment={post}
              dbUserId={user?.id ?? ""}
              className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-5"
              onEvent={() => refetch()}
            />
          </Fragment>
        ))}
      </div>
      {/* Loading indicator */}
      <div ref={ref}>{isFetchingNextPage && <SkeletonList />}</div>
    </>
  );
}
