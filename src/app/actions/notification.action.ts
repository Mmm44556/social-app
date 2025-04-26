"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getNotifications(cursor?: string) {
  const userId = await getDbUserId();
  if (!userId) return { notifications: [], nextCursor: null };

  const take = 8; // Number of items per page

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    take: take + 1, // Take one extra to check if there are more items
    ...(cursor && {
      cursor: {
        id: cursor,
      },
      skip: 1, // Skip the cursor item
    }),
    include: {
      user: true,
      comment: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          isRoot: true,
        },
      },
      creator: {
        select: {
          id: true,
          tagName: true,
          username: true,
          imageUrl: true,
          createdAt: true,
          avatarUrl: true,
          bio: true,
          _count: {
            select: {
              followers: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const hasNextPage = notifications.length > take;
  const items = hasNextPage ? notifications.slice(0, -1) : notifications;
  const nextCursor = hasNextPage ? items[items.length - 1].id : null;

  return {
    notifications: items,
    nextCursor,
  };
}

export async function readNotification(notificationIds: string[]) {
  const { userId } = await auth();
  if (!userId) return { success: false };
  try {
    await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds,
        },
      },
      data: {
        read: true,
      },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
