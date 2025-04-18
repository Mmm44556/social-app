"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/comment/PostCard";
import { PostType } from "@/types/post";
import { isEmpty } from "lodash-es";
import { LoaderCircle } from "lucide-react";
import useInfiniteScrollComments from "@/hooks/useInfiniteScrollComments";
import NoData from "./NoData";
interface CommentsProps {
  tagName: string;
  dbUserId: string | null;
}

export function Comments({ tagName, dbUserId }: CommentsProps) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    status,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteScrollComments({
    tagName,
    isRoot: true,
    queryKey: ["comments", tagName],
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending")
    return (
      <div className="flex items-center justify-center p-12">
        <LoaderCircle className="w-6 h-6 animate-spin" />
      </div>
    );

  if (status === "error") return <div>Error: {(error as Error).message}</div>;
  if (isEmpty(data))
    return (
      <NoData
        title="No posts yet"
        description="When you create a post, it will show up here."
      />
    );

  return (
    <div>
      <button onClick={() => refetch()}>refetch</button>
      {data?.pages.map((group, i) => {
        return (
          <div key={i}>
            {group.map((comment) => {
              return (
                <Fragment key={comment.id}>
                  <PostCard
                    comment={comment as unknown as PostType}
                    dbUserId={dbUserId}
                    className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-5"
                  />
                </Fragment>
              );
            })}
          </div>
        );
      })}
      <div ref={ref} className="flex items-center justify-center p-4">
        {isFetchingNextPage && (
          <LoaderCircle className="w-6 h-6 animate-spin" />
        )}
      </div>
    </div>
  );
}
