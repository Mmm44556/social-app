"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";

export async function getNotifications() {
  const userId = await getDbUserId();
  if (!userId) return [];

  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },

    include: {
      user: true,
      comment: {
        select: {
          id: true,
          content: true,
          images: true,
          createdAt: true,
        },
      },
      creator: {
        select: {
          id: true,
          tagName: true,
          username: true,
          imageUrl: true,
          createdAt: true,
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
  return notifications;
}

export async function readNotification(notificationIds: string[]) {
  const { userId } = await auth();
  if (!userId) return;

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
}
