import {
  getCommentsByTagName,
  GetCommentsByTagNameProps,
} from "@/app/actions/profile.action";
import { useInfiniteQuery } from "@tanstack/react-query";

type Replies = Awaited<ReturnType<typeof getCommentsByTagName>>[number];

type UseInfiniteScrollCommentsProps = GetCommentsByTagNameProps & {
  queryKey?: string[];
};
export default function useInfiniteScrollComments({
  ...props
}: UseInfiniteScrollCommentsProps) {
  return useInfiniteQuery({
    queryKey:
      props.queryKey?.length && props.queryKey?.length > 0
        ? props.queryKey
        : [props.tagName],
    queryFn: async ({ pageParam = undefined }) => {
      const comments = await getCommentsByTagName({
        limit: 5,
        cursor: pageParam as string,
        isRoot: false,
        ...props,
      });
      return comments;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: Replies[]) => {
      if (lastPage.length === 0) return undefined;
      return lastPage[lastPage.length - 1]?.id;
    },
  });
}
