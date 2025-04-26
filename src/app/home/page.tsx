"use client";

import CreatePost from "@/components/CreatePost";
import { Fragment, useEffect, useState, Suspense } from "react";
import PostCard from "@/components/comment/PostCard";
import { getDbUserId, getUserByClerkId } from "@/app/actions/user.action";
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useFeed } from "@/hooks/useFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonList } from "@/components/CustomSkeletons";

export default function HomePage() {
  const { ref, inView } = useInView();
  const [dbUserId, setDbUserId] = useState<string | null>(null);
  const [dbUser, setDbUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const id = await getDbUserId();
      setDbUserId(id);
      if (id) {
        const user = await getUserByClerkId(id);
        setDbUser(user);
      }
    };
    fetchUser();
  }, []);

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
      <CreatePost dbUser={dbUser} className="mb-10" />
      {/* Main Posts */}

      <div className="border-t">
        {isLoading && <SkeletonList />}
        {posts.map((post) => (
          <Fragment key={post.id}>
            <PostCard
              comment={post}
              dbUserId={dbUserId}
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
