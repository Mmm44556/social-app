"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/comment/PostCard";
import { PostType } from "@/types/post";
import { isEmpty } from "lodash-es";
import { LoaderCircle } from "lucide-react";
import useInfiniteScrollComments from "@/hooks/useInfiniteScrollComments";
import NoData from "./NoData";
import { TabComponentProps } from "@/app/(user)/[userTagName]/page";
import { SkeletonList } from "../CustomSkeletons";

export default function Comments({ tagName, dbUserId }: TabComponentProps) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    status,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetched,
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

  if (status === "error") return <div>Error: {(error as Error).message}</div>;

  if (isEmpty(data) && isFetched)
    return (
      <NoData
        title="No posts yet"
        description="When you create a post, it will show up here."
      />
    );

  return (
    <div>
      {isLoading && <SkeletonList length={5} />}
      {data?.pages?.map((group, i) => {
        return (
          <div key={i}>
            {group?.map((comment) => {
              return (
                <Fragment key={comment.id}>
                  <PostCard
                    comment={comment as unknown as PostType}
                    dbUserId={dbUserId}
                    className="bg-transparent border-0 border-b rounded-none hover:shadow-none p-4 py-3"
                    onEvent={() => refetch()}
                  />
                </Fragment>
              );
            })}
          </div>
        );
      })}
      <div ref={ref}>{isFetchingNextPage && <SkeletonList length={5} />}</div>
    </div>
  );
}
