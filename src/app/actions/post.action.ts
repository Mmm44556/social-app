"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl: string;
}) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");
    const post = await prisma.post.create({
      data: {
        content,
        images: [imageUrl],
        authorId: userId,
      },
    });
    revalidatePath("/home");
    return { success: true, post };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            username: true,
            email: true,
            imageUrl: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                email: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },

        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get posts");
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");

    // check if like exists
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // delete like
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      // like and create notification (only if user is not the author of the post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            postId,
            userId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  userId: post.authorId,
                  postId,
                  type: "LIKE",
                  creatorId: userId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function createComment({
  postId,
  content,
  imageUrl,
}: {
  postId: string;
  content: string;
  imageUrl: string;
}) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");
    if (!content && !imageUrl)
      throw new Error("Content or imageUrl is required");

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    const [comment] = await prisma.$transaction(async (tx) => {
      // create comment
      const newCommnent = await prisma.comment.create({
        data: {
          postId,
          content,
          images: [imageUrl],
          authorId: userId,
        },
      });

      // create notification (only if user is not the author of the post)
      if (post.authorId !== userId) {
        await tx.notification.create({
          data: {
            type: "COMMENT",
            userId: post.authorId,
            postId,
            creatorId: userId,
            commentId: newCommnent.id,
          },
        });
      }

      return [newCommnent];
    });

    revalidatePath("/home");
    return { success: true, comment };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to create comment" };
  }
}

export async function deletePost(postId: string) {
  try {
    const userId = await getDbUserId();

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("You are not the author");

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/home");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete post" };
  }
}
