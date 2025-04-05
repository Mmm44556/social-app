import CreatePost from "@/components/CreatePost";
import { getFeed } from "@/app/actions/test";
import { Fragment } from "react";
import PostCard from "@/components/PostCard";
import { getDbUserId } from "@/app/actions/user.action";

export default async function HomePage() {
  const { posts } = await getFeed();
  // 用來處理用戶按讚
  const dbUserId = await getDbUserId();
  // if (!dbUserId) return null;
  return (
    <>
      <CreatePost />

      {/* Main Posts */}
      {posts.map((post) => (
        <Fragment key={post.id}>
          <PostCard post={post} dbUserId={dbUserId} />
        </Fragment>
      ))}
    </>
  );
}
