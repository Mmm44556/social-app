import { getDbUserId } from "@/app/actions/user.action";
import {
  findRootPostOptimized,
  getContent,
} from "@/app/actions/comment.action";
import ReplyCard from "@/components/comment/ReplyCard";
import RootCard from "@/components/comment/RootCard";
import { cn } from "@/lib/utils";
import { Fragment } from "react";
import { PostType } from "@/types/post";
interface PostPageProps {
  params: Promise<{ userTagName: string; postId: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId, userTagName } = await params;
  const post = await getContent(postId, userTagName);
  const rootPost = await findRootPostOptimized(postId);
  const dbUserId = await getDbUserId();
  if (!post) return null;
  return (
    <>
      <div className="flex flex-col gap-0 px-4">
        {/* 貼文 */}
        <RootCard
          post={rootPost as PostType}
          dbUserId={dbUserId}
          className={cn(
            "hover:bg-transparent",
            post.content?.isRoot === false ? "border-b-0" : ""
          )}
          enableConnectedLine={Boolean(post.ancestors?.length)}
        />

        {/* 祖先留言(代表點進回覆的留言，所以才有祖先) */}
        {post.ancestors &&
          post.ancestors
            .filter((comment) => comment.isRoot === false)
            .map((comment) => (
              <div className="relative " key={comment.id}>
                <ReplyCard
                  comment={comment}
                  dbUserId={dbUserId}
                  enableConnectedLine={
                    post.content && post.content.isRoot === false
                  }
                  className="hover:bg-transparent"
                />
              </div>
            ))}

        {/* 如果不是根貼文，則顯示當前選擇的回覆 */}
        {post.content && post.content.isRoot === false && (
          <div className="relative">
            <RootCard
              post={post.content}
              dbUserId={dbUserId}
              className="hover:bg-transparent"
            />
          </div>
        )}
      </div>

      {/* 回覆 */}
      <div className="px-3">
        <div className="py-2">
          <span className="text-md text-muted-foreground">Replies</span>
        </div>

        {post.replies &&
          post.replies.map((comment, idx) => {
            return (
              <Fragment key={idx}>
                <ReplyCard
                  comment={comment}
                  dbUserId={dbUserId}
                  className="py-4 border-t hover:bg-transparent"
                />
              </Fragment>
            );
          })}
      </div>
    </>
  );
}
