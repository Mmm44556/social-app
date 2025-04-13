import { getFeed } from "@/app/actions/comment.action";

export type PostType = Awaited<ReturnType<typeof getFeed>>["posts"][number];
