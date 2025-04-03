"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return null;

    // check if user exists in db
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        username: `${user.firstName || ""} ${user.lastName || ""}`,
        imageUrl: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.error("Error syncing user", error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
            likes: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("User not found");
  try {
    const user = await getUserByClerkId(clerkId);
    return user?.id;
  } catch (error) {
    console.error("Error getting user by clerkId", error);
    return null;
  }
}

export async function getSuggestedUsers() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const users = await prisma.user.findMany({
      where: {
        clerkId: { not: userId },
      },
    });
    return users;
  } catch (error) {
    console.error("Error getting suggested users", error);
    return [];
  }
}
