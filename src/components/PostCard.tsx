"use client";

import { memo, useState } from "react";
import { CalendarDays, EllipsisIcon, Pencil, Trash2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import formatTimeOrDate from "@/utils/formatTimeOrDate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { deletePost } from "@/app/actions/post.action";
import { PostType } from "@/types/post";
import CommentDialog from "@/components/CommentDialog";
import LikeButton from "./LikeButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import DeleteDialog from "./DeleteDialog";
import { useRouter } from "next/navigation";
import FollowButton from "./FollowButton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import ShareButton from "./ShareButton";
interface PostProps {
  post: PostType;
  dbUserId: string | null;
}
export default function PostCard({ post, dbUserId }: PostProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const flushEmptyImages = post.images.filter((image) => image !== "");
  const handleDelete = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      await deletePost(post.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleCardClick = async (e: React.MouseEvent) => {
    // 如果有選取文字，不觸發跳轉
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      return;
    }

    await router.push(`/${post.author.tagName}/post/${post.id}`);
    router.refresh();
  };
  return (
    <Card
      className="rounded-xl shadow-none border p-6 hover:bg-gray-50 hover:cursor-pointer hover:shadow-sm transition-colors duration-200"
      onClick={handleCardClick}
    >
      <CardContent className="px-0 relative">
        <HoverCard openDelay={250}>
          <div className="flex items-stretch gap-2">
            <HoverCardTrigger asChild>
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.imageUrl ?? ""} />
                <AvatarFallback>
                  {post.author?.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>

            <div className="basis-full">
              {/* Hover Card */}
              <div className="flex items-center gap-2">
                <HoverCardTrigger asChild>
                  <AuthorHeader
                    post={post}
                    className="flex items-center gap-2"
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex gap-2 items-center">
                    <Avatar className="h-8 w-8 self-start">
                      <AvatarImage src={post.author.imageUrl ?? ""} />
                      <AvatarFallback>
                        {post.author?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1 basis-full">
                      <h4 className="flex items-center justify-between text-sm font-semibold">
                        <AuthorHeader post={post} className="text-sm" />
                        <FollowButton
                          postUserId={post.authorId}
                          className="text-xs px-2 h-7"
                          size="sm"
                        />
                      </h4>

                      <div className="flex items-center pt-2">
                        <User className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          {post.author._count.followers} followers
                        </span>
                      </div>
                      {post.author.bio && (
                        <div className="flex items-center pt-2">
                          <span className="text-xs text-muted-foreground">
                            {post.author.bio}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                        <span className="text-xs text-muted-foreground">
                          Joined {format(post.author.createdAt, "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>

                <span className="text-sm text-muted-foreground">
                  · {formatTimeOrDate(post.createdAt)}
                </span>
              </div>

              {/* Post Content */}
              <p className="mt-1">{post.content}</p>

              {/* Post Images */}
              {flushEmptyImages.length > 0 && (
                <div className="mt-3 flex gap-3">
                  {flushEmptyImages.map((image) => (
                    <div className="aspect-video rounded-lg bg-muted" />
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center gap-3">
                {/* Like Button */}
                <LikeButton post={post} dbUserId={dbUserId} />

                {/* Comment Button */}
                <CommentDialog post={post} />

                {/* Share Button */}
                <ShareButton post={post} />
              </div>
            </div>
          </div>
        </HoverCard>
        {post.authorId === dbUserId && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="absolute right-0 top-0 cursor-pointer hover:bg-gray-200 rounded-full"
              onClick={(e) => e.stopPropagation()}
            >
              <EllipsisIcon className="size-5" />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="[&_div]:hover:bg-gray-100 [&_div]:hover:cursor-pointer ">
              <DropdownMenuItem>
                Edit <Pencil />
              </DropdownMenuItem>

              <DeleteDialog onDelete={handleDelete}>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  Delete <Trash2 />
                </DropdownMenuItem>
              </DeleteDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardContent>
    </Card>
  );
}

interface AuthorHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  post: PostType;
}
function AuthorHeaderComponent({
  post,
  className,
  ...props
}: AuthorHeaderProps) {
  const router = useRouter();
  const handleAuthorProfileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/${post.author.tagName}`);
    router.refresh();
  };
  return (
    <p
      onClick={handleAuthorProfileClick}
      className={cn("hover:cursor-pointer hover:underline", className)}
      {...props}
    >
      <span className="font-semibold">{post.author.username}</span>
      <span className="text-muted-foreground">@{post.author.tagName}</span>
    </p>
  );
}
export const AuthorHeader = memo(AuthorHeaderComponent);
