import { AuthorHeader } from "@/components/comment/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LikeButton from "@/components/LikeButton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import { format } from "date-fns";
import FollowButton from "@/components/FollowButton";
import CommentDialog from "@/components/CommentDialog";
import { getDbUserId } from "@/app/actions/user.action";
import ShareButton from "@/components/ShareButton";
import { findRootPostOptimized, getContent } from "@/app/actions/test";
import ReplyCard from "@/components/comment/ReplyCard";
import MainHeader from "@/components/MainHeader";
import RootCard from "@/components/comment/RootCard";
interface PostPageProps {
  params: Promise<{ userTagName: string; postId: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId, userTagName } = await params;
  const post = await getContent(postId);
  const rootPost = await findRootPostOptimized(postId);
  const dbUserId = await getDbUserId();
  if (!post) return null;
  console.log(post);
  return (
    <>
      {/* Header */}
      <MainHeader />

      {/* 貼文 */}
      <RootCard post={rootPost} dbUserId={dbUserId} />

      {/* 祖先留言(代表點進回覆的留言，所以才有祖先) */}
      <div className="space-y-8">
        {post.ancestors &&
          post.ancestors
            .filter((comment) => comment.isRoot === false)
            .map((comment) => (
              <ReplyCard
                key={comment.id}
                comment={comment}
                dbUserId={dbUserId}
              />
            ))}
      </div>

      {/* 如果不是根貼文，則顯示當前選擇的回覆 */}
      {post.content.isRoot === false && (
        <RootCard post={post.content} dbUserId={dbUserId} />
      )}

      {/* 回覆 */}
      <div className="space-y-2 px-3">
        <div className="pt-0">
          <span className="text-md text-muted-foreground">Replies</span>
        </div>

        <div className="space-y-8">
          {post.replies &&
            post.replies.map((comment) => (
              <ReplyCard
                key={comment.id}
                comment={comment}
                dbUserId={dbUserId}
              />
            ))}
        </div>
      </div>
    </>
  );
}
