import { getPosts } from "@/app/actions/post.action";

export type Post = Awaited<ReturnType<typeof getPosts>>[number];
