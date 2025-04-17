"use client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarDays, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import FollowButton from "@/components/FollowButton";
import { format } from "date-fns";

interface AuthorHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  author: {
    username: string;
    tagName: string;
    imageUrl: string | null;
    id: string;
    _count: {
      followers: number;
    };
    bio: string | null;
    createdAt: Date;
  };
}
function Header({ className, author, ...props }: AuthorHeaderProps) {
  return (
    <div
      className={cn("hover:cursor-pointer hover:underline", className)}
      {...props}
    >
      <span className="font-semibold">{author.username}</span>
      <span className="text-muted-foreground">@{author.tagName}</span>
    </div>
  );
}
export default function AuthorHeader({
  author,
  className,
  ...props
}: AuthorHeaderProps) {
  const router = useRouter();
  const handleAuthorProfileClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/${author.tagName}`);
    router.refresh();
  };
  return (
    <HoverCard openDelay={250}>
      <div className="flex items-stretch gap-2 hover:bg-gray-50 hover:cursor-pointer">
        <div className={cn("grow space-y-2p", className)}>
          {/* Hover Card */}
          <div className="flex items-center gap-2">
            <HoverCardTrigger asChild>
              <div
                className="flex items-center gap-2"
                onClick={handleAuthorProfileClick}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={author.imageUrl ?? ""} />
                  <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div
                  onClick={handleAuthorProfileClick}
                  className={cn(
                    "hover:cursor-pointer hover:underline",
                    className
                  )}
                  {...props}
                >
                  <span className="font-semibold">{author.username}</span>
                  <span className="text-muted-foreground max-sm:hidden">
                    @{author.tagName}
                  </span>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex gap-2 items-center">
                <Avatar className="h-8 w-8 self-start">
                  <AvatarImage src={author.imageUrl ?? ""} />
                  <AvatarFallback>{author.username.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 basis-full">
                  <h4 className="flex items-center justify-between text-sm font-semibold">
                    <Header author={author} className="text-sm" />
                    <FollowButton
                      postUserId={author.id}
                      className="text-xs px-2 h-7"
                      size="sm"
                    />
                  </h4>

                  <div className="flex items-center pt-2">
                    <User className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      {author._count.followers} followers
                    </span>
                  </div>
                  {author.bio && (
                    <div className="flex items-center pt-2">
                      <span className="text-xs text-muted-foreground">
                        {author.bio}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center pt-2">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-muted-foreground">
                      Joined {format(author.createdAt, "dd/MM/yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </div>
        </div>
      </div>
    </HoverCard>
  );
}
