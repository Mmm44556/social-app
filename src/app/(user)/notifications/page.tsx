"use client";

import { Fragment, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  getNotifications,
  readNotification,
} from "@/app/actions/notification.action";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  MessageSquare,
  Search,
  Bell,
  User,
  Settings,
  Heart,
  Share,
  Tag,
  ListCheck,
} from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { formatDistanceToNow } from "date-fns";
import AuthorHeader from "@/components/AuthorHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const notificationIcon = {
  MESSAGE: {
    icon: MessageSquare,
    color: "text-blue-500",
  },
  LIKE: {
    icon: Heart,
    color: "text-red-500",
  },
  SHARE: {
    icon: Share,
    color: "text-green-500",
  },
  FOLLOW: {
    icon: User,
    color: "text-purple-500",
  },
  COMMENT: {
    icon: Icons.comment,
    color: "text-gray-500",
  },
  TAG: {
    icon: Tag,
    color: "text-blue-500",
  },
};
type Notifications = Awaited<ReturnType<typeof getNotifications>>;

export default function NotificationsPage() {
  const { data = [], isLoading } = useQuery<Notifications>({
    queryKey: ["notifications"],
    queryFn: async () => getNotifications(),
    placeholderData: [],
  });
  const unreadNotifications = data.filter(
    (notification) => notification.read === false
  );
  console.log(data);
  return (
    <ScrollArea className="max-h-[100dvh] h-full  rounded-md border py-4">
      <div className="px-6 min-h-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full ml-auto block w-8 h-8 p-1"
          asChild
        >
          <ListCheck className="" />
        </Button>
      </div>
      <div className="divide-y divide-gray-200">
        {data.map((notification, idx) => {
          const Icon =
            notificationIcon[
              notification.type as keyof typeof notificationIcon
            ];
          return (
            <Fragment key={idx}>
              <div
                className={cn(
                  "text-sm flex gap-2 py-4 px-6 min-h-24 cursor-pointer hover:bg-gray-50 ",
                  notification.read
                    ? "bg-transparent "
                    : "hover:transition-colors hover:duration-200 "
                )}
              >
                {/* <div className="py-2">
                  <div className="py-2 border rounded-full w-10 h-10 flex items-center justify-center">
                    <Icon.icon className={cn(Icon.color, "size-5")} />
                  </div>
                </div> */}
                <div className="flex flex-col gap-1 grow relative">
                  <p className="flex gap-2 justify-between items-center">
                    <AuthorHeader author={notification.creator} />
                    <span className="text-gray-400 ">
                      {formatDistanceToNow(notification.createdAt)}
                    </span>
                  </p>
                  <span>{notification.comment?.content}</span>
                  {!notification.read && (
                    <div className="bg-notification-blue w-2 h-2 absolute right-32 top-1/2 -translate-y-1/2 rounded-full" />
                  )}
                </div>
              </div>
              {/* <Separator className="my-2" /> */}
            </Fragment>
          );
        })}
      </div>
    </ScrollArea>
  );
}
