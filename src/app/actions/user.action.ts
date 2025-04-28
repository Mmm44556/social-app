"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return null;

    // check if user exists in db
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        avatarUrl: true,
        id: true,
        username: true,
        tagName: true,
        email: true,
        imageUrl: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            comments: true,
            likes: true,
          },
        },
        receivedNotifications: {
          where: {
            read: false,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (existingUser) return existingUser;
    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email:
          user.emailAddresses.length > 0
            ? user.emailAddresses[0].emailAddress
            : "",
        tagName:
          user.emailAddresses.length > 0
            ? user.emailAddresses[0].emailAddress?.split("@")?.[0] || ""
            : "",
        username:
          user.username?.trim() ||
          `${user.firstName?.trim() || ""} ${user.lastName?.trim() || ""}`,
        avatarUrl: user.imageUrl,
      },
      select: {
        username: true,
        tagName: true,
        imageUrl: true,
        avatarUrl: true,
        email: true,
        id: true,
        _count: {
          select: {
            followers: true,
            following: true,
            comments: true,
            likes: true,
          },
        },
        receivedNotifications: {
          where: {
            read: false,
          },
        },
      },
    });

    // Create a separate server action to handle revalidation
    await revalidateUser();

    return dbUser;
  } catch (error) {
    console.error("Error syncing user", error);
    return null;
  }
}

// Separate server action for revalidation
async function revalidateUser() {
  "use server";
  revalidatePath("/home");
}

export type DB_User = Awaited<ReturnType<typeof getUserByClerkId>>;
export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },

      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            comments: true,
            likes: true,
          },
        },
        receivedNotifications: {
          where: {
            read: false,
          },
          select: {
            id: true,
          },
        },
      },
    });
    if (!user) {
      return await syncUser();
    } else {
      return user;
    }
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}

export async function getUserFollowers(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        following: {
          select: {
            followingId: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user followers", error);
    return null;
  }
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  try {
    const user = await getUserByClerkId(clerkId);
    return user?.id || null;
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}
export async function getDbUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  try {
    const user = await getUserByClerkId(clerkId);
    return user || null;
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}

export async function getSuggestedUsers() {
  try {
    const userId = await getDbUserId();
    if (!userId) return [];
    // get 3 users except the current user and the users that the current user is not following
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { NOT: { followers: { some: { followerId: userId } } } },
        ],
      },
      take: 3,
      select: {
        id: true,
        username: true,
        imageUrl: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    console.error("Error getting suggested users", error);
    return [];
  }
}

export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // follow
      await prisma.$transaction([
        prisma.follow.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),

        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // user being followed
            creatorId: userId, // user following
          },
        }),
      ]);
    }

    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.log("Error in toggleFollow", error);
    return { success: false, error: "Error toggling follow" };
  }
}

export async function getUsersForMessages() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Get the current user's database ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get users that the current user is following
    const followingUsers = await prisma.follow.findMany({
      where: {
        followerId: currentUser.id,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            isDeleted: true,
          },
        },
      },
    });

    // Get users with message history
    const messageUsers = await prisma.message.findMany({
      where: {
        OR: [{ senderId: currentUser.id }, { receiverId: currentUser.id }],
      },
      select: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            isDeleted: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            isDeleted: true,
          },
        },
      },
      distinct: ["senderId", "receiverId"],
    });

    // Combine and deduplicate users
    const userMap = new Map();

    // Add following users
    followingUsers.forEach((follow) => {
      if (!follow.following.isDeleted) {
        userMap.set(follow.following.id, {
          id: follow.following.id,
          username: follow.following.username,
          avatarUrl: follow.following.avatarUrl,
        });
      }
    });

    // Add message users
    messageUsers.forEach((message) => {
      // Add sender if not current user and not deleted
      if (message.sender.id !== currentUser.id && !message.sender.isDeleted) {
        userMap.set(message.sender.id, {
          id: message.sender.id,
          username: message.sender.username,
          avatarUrl: message.sender.avatarUrl,
        });
      }
      // Add receiver if not current user and not deleted
      if (
        message.receiver.id !== currentUser.id &&
        !message.receiver.isDeleted
      ) {
        userMap.set(message.receiver.id, {
          id: message.receiver.id,
          username: message.receiver.username,
          avatarUrl: message.receiver.avatarUrl,
        });
      }
    });

    // Convert map to array
    return Array.from(userMap.values());
  } catch (error) {
    console.error("[GET_USERS_FOR_MESSAGES]", error);
    return [];
  }
}
export type Message = Awaited<ReturnType<typeof getChatMessages>>[number];
export async function getChatMessages(otherUserId: string) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      throw new Error("Unauthorized");
    }

    // Get current user's database ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Get messages between two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUser.id,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: currentUser.id,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return messages;
  } catch (err) {
    console.error("[GET_CHAT_MESSAGES]", err);
    return [];
  }
}

export async function getUserByUserId(userId: string) {
  if (!userId) return null;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });
    return user;
  } catch (error) {
    console.error("[GET_USER_BY_USER_ID]", error);
    return null;
  }
}
