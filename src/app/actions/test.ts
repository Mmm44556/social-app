"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";
// 獲取頂層貼文（用於首頁 Feed）
export async function getFeed(limit = 20, cursor?: string) {
  try {
    const where = {
      isRoot: true,
      isDeleted: false,
    };

    const pagination = cursor
      ? {
          cursor: { id: cursor },
          skip: 1,
        }
      : null;

    const posts = await prisma.comment.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            tagName: true,
            bio: true,
            createdAt: true,
            _count: {
              select: {
                followers: true,
                likes: true,
              },
            },
          },
        },

        descendants: {
          where: {
            NOT: {
              depth: 0,
            },
          },
        },

        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      ...(pagination || {}),
    });

    const postsWithCounts = posts.map((post) => ({
      ...post,
      replyCount: post.descendants.length,
      likeCount: post.likes.length,
    }));

    const nextCursor =
      postsWithCounts.length === limit
        ? postsWithCounts[postsWithCounts.length - 1].id
        : null;

    return {
      posts: postsWithCounts,
      nextCursor,
    };
  } catch (error) {
    console.error("Error getting feed:", error);
    throw new Error(`Failed to get feed: ${error.message}`);
  }
}

// 創建新貼文
export async function createPost({
  content,
  imagesUrl,
}: {
  content: string;
  imagesUrl: string[];
}) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");
    // 使用事務來確保貼文和閉包表一起創建
    const post = await prisma.$transaction(async (tx) => {
      // 1. 創建新貼文
      const newPost = await tx.comment.create({
        data: {
          content,
          images: imagesUrl,
          authorId: userId,
          isRoot: true, // 標記為頂層貼文
        },
      });

      // 2. 創建指向自身的閉包表記錄 (深度 0)
      await tx.commentClosure.create({
        data: {
          ancestorId: newPost.id,
          descendantId: newPost.id,
          depth: 0,
        },
      });

      return newPost;
    });
    revalidatePath("/home");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

// 獲取內容 (貼文或留言)
export async function getContent(id: string) {
  try {
    // 獲取內容基本信息
    const content = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            tagName: true,
            bio: true,
            createdAt: true,
            _count: {
              select: {
                followers: true,
                likes: true,
              },
            },
          },
        },
        descendants: {
          where: {
            NOT: {
              depth: 0,
            },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            descendants: true,
          },
        },
      },
    });
    if (!content) {
      throw new Error("Content not found");
    }

    const contentWithCounts = {
      ...content,
      replyCount: content.descendants.length,
      likeCount: content.likes.length,
    };

    // 獲取回覆
    const replies = await prisma.comment.findMany({
      where: {
        ancestors: {
          some: {
            ancestorId: id,
            depth: 1,
          },
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
            tagName: true,
            createdAt: true,
            bio: true,
            _count: {
              select: {
                followers: true,
                likes: true,
              },
            },
          },
        },
        descendants: {
          where: {
            depth: 1,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const repliesWithCounts = replies.map((reply) => ({
      ...reply,
      replyCount: reply.descendants.length,
      likeCount: reply.likes.length,
    }));

    // 如果不是頂層貼文，獲取祖先內容
    const ancestors = !content.isRoot
      ? await prisma.comment.findMany({
          where: {
            descendants: {
              some: {
                descendantId: id,
                depth: { gt: 0 },
              },
            },
          },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                imageUrl: true,
                tagName: true,
                createdAt: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : [];

    // 返回結構化內容
    return {
      type: content.isRoot ? "post" : "comment",
      content: contentWithCounts,
      replies: repliesWithCounts,
      replyCount: replies.length,
      likeCount: content.likes.length,
      ancestors,
    };
  } catch (error) {
    console.error("Error getting content:", error);
    throw new Error(`Failed to get content: ${error.message}`);
  }
}

// 創建回覆
export async function createReply({
  parentId,
  content,
  images,
}: {
  parentId: string;
  content: string;
  images: string[];
}) {
  try {
    const authorId = await getDbUserId();
    if (!authorId) throw new Error("User not found");
    // 檢查父內容是否存在
    const parentExists = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentExists) {
      throw new Error("Parent content not found");
    }

    // 使用事務來確保所有操作一起完成
    const reply = await prisma.$transaction(async (tx) => {
      // 1. 創建新回覆
      const newReply = await tx.comment.create({
        data: {
          content,
          images,
          authorId,
          isRoot: false, // 標記為回覆
        },
      });

      // 2. 創建指向自身的閉包表記錄 (深度 0)
      await tx.commentClosure.create({
        data: {
          ancestorId: newReply.id,
          descendantId: newReply.id,
          depth: 0,
        },
      });

      // 3. 獲取父內容的所有祖先記錄
      const parentClosures = await tx.commentClosure.findMany({
        where: {
          descendantId: parentId,
        },
      });

      // 4. 為每個祖先創建與新回覆的關係
      const closurePromises = parentClosures.map((closure) =>
        tx.commentClosure.create({
          data: {
            ancestorId: closure.ancestorId,
            descendantId: newReply.id,
            depth: closure.depth + 1,
          },
        })
      );

      await Promise.all(closurePromises);

      return newReply;
    });
    revalidatePath("/home");
    return { success: true, reply };
  } catch (error) {
    console.error("Error creating reply:", error);
    throw new Error(`Failed to create reply: ${error.message}`);
  }
}
