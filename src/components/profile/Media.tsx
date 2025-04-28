"use client";

import { PostType } from "@/types/post";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { flatten, isEmpty } from "lodash-es";
import { Play } from "lucide-react";
import useInfiniteScrollMedia from "@/hooks/useInfiniteScrollMedia";
import NoData from "@/components/profile/NoData";
import { mediaType } from "@/components/MediaCarousel";
import CommentDialog from "@/components/CommentDialog";
import { TabComponentProps } from "@/app/(user)/[userTagName]/page";
import { SkeletonList } from "@/components/CustomSkeletons";

export default function Media({ tagName }: TabComponentProps) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    status,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetched,
    isLoading,
  } = useInfiniteScrollMedia({
    tagName,
    queryKey: ["media", tagName],
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
        title="No media yet"
        description="When you post photos or videos, they will show up here."
      />
    );
  return (
    <div className="p-4">
      {isLoading && (
        <div className="p-4">
          <SkeletonList
            type="media"
            className="grid grid-cols-3 gap-1"
            length={6}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-1">
        {data?.pages?.map((group, i) => (
          <div key={i} className="contents">
            {group?.map((media) => {
              return (
                <div
                  key={media.id}
                  className="relative aspect-square overflow-hidden"
                >
                  {media?.imagesWithMetadata?.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square relative cursor-pointer group"
                    >
                      {mediaType({
                        url: image.url,
                        type: image.metadata?.contentType ?? "",
                        width: 300,
                        height: 350,
                        className: "aspect-square",
                      })}
                      {image.metadata?.contentType?.includes("video") && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 flex gap-4 text-white">
                          <CommentDialog
                            comment={media as unknown as PostType}
                            onEvent={() => {}}
                            className="bg-opacity-0 hover:bg-opacity-100 group-hover:bg-black/50 absolute top-0 inset-0 z-50 h-full w-full rounded-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="p-4">
            <SkeletonList
              type="media"
              className="grid grid-cols-3 gap-1"
              length={6}
            />
          </div>
        )}
      </div>
    </div>
  );
}
