"use client";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import PostCard from "@/components/comment/PostCard";
import { PostType } from "@/types/post";
import { cn } from "@/lib/utils";
import { flatten, isEmpty } from "lodash-es";
import useInfiniteScrollComments from "@/hooks/useInfiniteScrollComments";
import NoData from "./NoData";
import { TabComponentProps } from "@/app/(user)/[userTagName]/page";
import { SkeletonList } from "../CustomSkeletons";
export default function Replies({ tagName, dbUserId }: TabComponentProps) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    status,
    isFetchingNextPage,
    isFetched,
    isLoading,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteScrollComments({
    tagName,
    queryKey: ["replies", tagName],
  });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "error") return <div>Error: {(error as Error).message}</div>;

  if (isEmpty(flatten(data?.pages)) && isFetched)
    return (
      <NoData
        title="No replies yet"
        description="When you reply to someone, it will show up here."
      />
    );
  return (
    <div className="mt-2">
      {isLoading && <SkeletonList length={5} />}

      {data?.pages?.map((group, i) => {
        return (
          <div key={i}>
            {group?.map((comment) => {
              return (
                <div key={comment.id} className="py-2">
                  {comment.ancestors.map((ancestor, index) => (
                    <Fragment key={ancestor.id}>
                      <PostCard
                        comment={ancestor as PostType}
                        dbUserId={dbUserId}
                        className={cn(
                          "bg-transparent border-0 rounded-none hover:shadow-none py-0",
                          index === comment.ancestors.length - 1
                            ? "border-b"
                            : ""
                        )}
                        enableConnectedLine={
                          index !== comment.ancestors.length - 1
                        }
                        onEvent={() => refetch()}
                      />
                    </Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        );
      })}
      <div ref={ref}>{isFetchingNextPage && <SkeletonList length={5} />}</div>
    </div>
  );
}
