import { getContent, getFeed } from "@/app/actions/test";

export type PostType = Awaited<ReturnType<typeof getFeed>>["posts"][number];
