import { useInfiniteQuery } from "@tanstack/react-query";
import { getFeed } from "@/app/actions/comment.action";

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: async ({ pageParam }: { pageParam?: string }) => {
      const { posts, nextCursor } = await getFeed(5, pageParam);
      return { posts, nextCursor };
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
