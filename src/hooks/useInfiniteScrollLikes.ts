import { getLikesByTagName } from "@/app/actions/profile.action";
import { useInfiniteQuery } from "@tanstack/react-query";

type UserWithLikes = NonNullable<
  Awaited<ReturnType<typeof getLikesByTagName>>
>[number];

type UseInfiniteScrollLikesProps = {
  tagName: string;
  queryKey?: string[];
  limit?: number;
};

export default function useInfiniteScrollLikes({
  tagName,
  queryKey,
  limit = 10,
}: UseInfiniteScrollLikesProps) {
  return useInfiniteQuery({
    queryKey: queryKey?.length ? queryKey : [tagName],
    queryFn: async ({ pageParam }) => {
      const likes = await getLikesByTagName(tagName);
      if (!likes) return [];

      // If we have a pageParam, find the index of the last item from previous page
      const startIndex = pageParam
        ? likes.findIndex((like) => like.id === pageParam) + 1
        : 0;

      // Return the next page of items
      return likes.slice(startIndex, startIndex + limit);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: UserWithLikes[]) => {
      if (lastPage.length < limit) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
  });
}
