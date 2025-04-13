"use client";
import { Fragment, useEffect } from "react";
import { getCommentsByTagName } from "@/app/actions/profile.action";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "@/components/comment/PostCard";
import { PostType } from "@/types/post";
import { cn } from "@/lib/utils";
interface RepliesProps {
  tagName: string;
  dbUserId: string | null;
}

type Replies = Awaited<ReturnType<typeof getCommentsByTagName>>[number];

export function Replies({ tagName, dbUserId }: RepliesProps) {
  const { ref, inView } = useInView();

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["replies", tagName],
    queryFn: async ({ pageParam = undefined }) => {
      const comments = await getCommentsByTagName({
        tagName,
        limit: 4,
        cursor: pageParam,
        isRoot: false,
      });
      return comments;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: Replies[]) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {(error as Error).message}</div>;
  if (!data?.pages[0]?.length) return <NoReplies />;
  return (
    <div className="mt-2">
      {data.pages.map((group, i) => (
        <div key={i} className="space-y-4 ">
          {group.map((comment) => {
            return (
              <div>
                {comment.ancestors.map((ancestor, index) => (
                  <Fragment key={ancestor.id}>
                    <PostCard
                      comment={ancestor as PostType}
                      dbUserId={dbUserId}
                      className={cn(
                        "bg-transparent border-0 rounded-none hover:shadow-none py-0",
                        index === comment.ancestors.length - 1 ? "border-b" : ""
                      )}
                      enableConnectedLine={
                        index !== comment.ancestors.length - 1
                      }
                    />
                  </Fragment>
                ))}
              </div>
            );
          })}
        </div>
      ))}
      <div ref={ref} className="h-10">
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  );
}

function NoReplies() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <h3 className="text-lg font-medium">No replies yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          When you reply to someone, it will show up here.
        </p>
      </div>
    </div>
  );
}
