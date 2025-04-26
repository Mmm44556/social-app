import {
  getMediaByTagName,
  GetMediaByTagNameProps,
} from "@/app/actions/profile.action";
import { useInfiniteQuery } from "@tanstack/react-query";
import { HeadBlobResult } from "@vercel/blob";

type Media = Awaited<ReturnType<typeof getMediaByTagName>>[number];

type UseInfiniteScrollMediaProps = GetMediaByTagNameProps & {
  queryKey?: string[];
};

export default function useInfiniteScrollMedia({
  tagName,
  queryKey,
}: UseInfiniteScrollMediaProps) {
  return useInfiniteQuery({
    queryKey: queryKey || ["media", tagName],
    queryFn: async ({ pageParam = undefined }) => {
      const media = await getMediaByTagName({
        tagName,
        limit: 5,
        cursor: pageParam as string,
      });

      // Fetch metadata for each image URL
      const mediaWithMetadata = await Promise.all(
        media.map(async (item) => {
          const imagesWithMetadata = await Promise.all(
            item.images.map(async (imageUrl) => {
              try {
                const response = await fetch(`/api/image?url=${imageUrl}`);
                const metadata = (await response.json()) as HeadBlobResult;
                return {
                  url: imageUrl,
                  metadata,
                };
              } catch (error) {
                console.error("Error fetching metadata for", imageUrl, error);
                return {
                  url: imageUrl,
                  metadata: null,
                };
              }
            })
          );

          return {
            ...item,
            imagesWithMetadata,
          };
        })
      );

      return mediaWithMetadata;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: Media[]) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
  });
}
