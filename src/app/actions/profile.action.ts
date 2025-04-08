"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
export async function getProfileByTagName(tagName: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { tagName },
      select: {
        username: true,
        tagName: true,
        imageUrl: true,
        email: true,
        id: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            following: true,
            comments: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting profile by tagName", error);
    return null;
  }
}

export async function getCommentsByTagName(tagName: string) {
  try {
    const comments = await prisma.user.findMany({
      where: {
        tagName,
      },
      include: {
        comments: true,
      },
    });
    return comments;
  } catch (error) {
    console.error("Error getting comments by tagName", error);
    return null;
  }
}

export async function getLikesByTagName(tagName: string) {
  try {
    const likes = await prisma.user.findMany({
      where: { tagName },
      include: {
        likes: true,
      },
    });
    return likes;
  } catch (error) {
    console.error("Error getting likes by tagName", error);
    return null;
  }
}

export async function getSharedsByTagName(tagName: string) {
  try {
    const shareds = await prisma.user.findMany({
      where: { tagName },
      include: {
        shares: true,
      },
    });
    return shareds;
  } catch (error) {
    console.error("Error getting shareds by tagName", error);
    return null;
  }
}

export async function updateProfile(formData: FormData) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  const { username, tagName, bio, imageUrl } = Object.fromEntries(formData) as {
    username: string;
    tagName: string;
    bio: string;
    imageUrl: string;
  };
  try {
    const user = await prisma.user.update({
      where: { clerkId },
      data: { username, tagName, bio, imageUrl },
    });
    revalidatePath(`/${user.tagName}`);
    return user;
  } catch (error) {
    console.error("Error updating profile", error);
    return null;
  }
}
