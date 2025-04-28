"use client";

import { Fragment, memo } from "react";
import {
  getNotifications,
  readNotification,
} from "@/app/actions/notification.action";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  User,
  Heart,
  Share,
  Tag,
  ListCheck,
} from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { formatDistanceToNow } from "date-fns";
import AuthorHeader from "@/components/AuthorHeader";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { SkeletonList } from "@/components/CustomSkeletons";
import BioText from "@/components/profile/BioText";
import HomeLayout from "@/app/home/layout";
type NotificationResponse = Awaited<ReturnType<typeof getNotifications>>;
type Notification = NotificationResponse["notifications"][number];

const notificationIcon = {
  MESSAGE: {
    icon: MessageSquare,
    color: "text-blue-500",
    messageFn: (notification: Notification) => {
      return `${notification.creator.username} sent you a message`;
    },
  },
  LIKE: {
    icon: Heart,
    color: "text-red-500",
    messageFn: (notification: Notification) => {
      if (notification.comment?.isRoot) {
        return `liked your post`;
      } else {
        return `liked your comment`;
      }
    },
  },
  SHARE: {
    icon: Share,
    color: "text-green-500",
    messageFn: (notification: Notification) => {
      if (notification.comment?.isRoot) {
        return `shared your post`;
      } else {
        return `shared your comment`;
      }
    },
  },
  FOLLOW: {
    icon: User,
    color: "text-purple-500",
    messageFn: () => {
      return `followed you`;
    },
  },
  COMMENT: {
    icon: Icons.comment,
    color: "text-gray-500",
    messageFn: (notification: Notification) => {
      if (notification.comment?.isRoot) {
        return `replied to your post`;
      } else {
        return `replied to your comment`;
      }
    },
  },
  TAG: {
    icon: Tag,
    color: "text-blue-500",
    messageFn: () => {
      return `tagged you in a post`;
    },
  },
};

export default function NotificationsPage() {
  const router = useRouter();
  const clerkUser = useUser();
  const { ref, inView } = useInView();
  const markAsRead = useMarkAsRead();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQuery<NotificationResponse>({
      queryKey: ["notifications", clerkUser?.user?.id],
      queryFn: async ({ pageParam }) => {
        const response = await getNotifications(
          pageParam as string | undefined
        );
        return response;
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: undefined,
      enabled: !!clerkUser?.user?.id,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
  return (
    <HomeLayout>
      <ScrollArea className="max-h-[100dvh-10rem] overflow-y-auto rounded-md border">
        <NotificationHeader
          notificationsIds={notifications.map(
            (notification) => notification.id
          )}
        />
        {isPending && <SkeletonList length={5} type="notification" />}
        <div className="divide-y divide-gray-200">
          {notifications.map((notification, idx) => {
            const Icon =
              notificationIcon[
                notification.type as keyof typeof notificationIcon
              ];
            return (
              <Fragment key={idx}>
                <div
                  className={cn(
                    "text-sm flex gap-2 py-4 px-6 h-full cursor-pointer hover:bg-gray-50",
                    notification.read
                      ? "bg-transparent"
                      : "hover:transition-colors hover:duration-200"
                  )}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead.mutate([notification.id]);
                    }

                    if (
                      ["COMMENT", "LIKE", "SHARE"].includes(notification.type)
                    ) {
                      router.push(
                        `/${notification.creator.tagName}/post/${notification.comment?.id}`
                      );
                    }
                    if (notification.type === "FOLLOW") {
                      router.push(
                        `/${notification.creator.tagName}/post/${notification.comment?.id}`
                      );
                    }
                  }}
                >
                  <div className="flex flex-col gap-1 grow relative">
                    <div className="flex gap-2 justify-between items-center">
                      <div className="flex gap-2 items-center">
                        <AuthorHeader author={notification.creator} />
                        <span className="text-muted-foreground">
                          {Icon.messageFn(notification)}
                        </span>
                      </div>

                      <span className="text-gray-400">
                        {formatDistanceToNow(notification.createdAt)}
                      </span>
                    </div>
                    <div className="grid grid-cols-[40px_1fr]">
                      <span></span>
                      <span className="text-gray-400 max-w-[75%]">
                        <BioText text={notification.comment?.content ?? ""} />
                      </span>
                    </div>
                    {!notification.read && (
                      <div className="bg-notification-blue w-2 h-2 absolute right-32 top-1/2 -translate-y-1/2 rounded-full" />
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}
          <div ref={ref}>
            {isFetchingNextPage && (
              <SkeletonList length={5} type="notification" />
            )}
          </div>
        </div>
      </ScrollArea>
    </HomeLayout>
  );
}

const NotificationHeader = memo(
  ({ notificationsIds }: { notificationsIds: string[] }) => {
    const markAsRead = useMarkAsRead();
    return (
      <div className="px-6 py-4 min-h-6 flex items-center justify-between border-b border-gray-200">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              asChild
              className="rounded-full cursor-pointer w-8 h-8 p-1 hover:bg-gray-200"
              onClick={() => {
                if (notificationsIds.length > 0) {
                  markAsRead.mutate(notificationsIds);
                }
              }}
            >
              <ListCheck />
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark all as read</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }
);

NotificationHeader.displayName = "NotificationHeader";

function useMarkAsRead() {
  const router = useRouter();
  const clerkUser = useUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationIds: string[]) => {
      const { success } = await readNotification(notificationIds);
      if (!success) {
        console.error("Failed to mark as read");
      }
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications", clerkUser?.user?.id],
      });
      router.refresh();
    },
  });
}
