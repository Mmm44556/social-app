"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";
import { redirect } from "next/navigation";
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
      select: {
        id: true,
        content: true,
        images: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        isRoot: true,
        authorId: true,
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
    return {
      posts: [],
      nextCursor: null,
    };
  }
}

// 創建新貼文
export async function createComment({ content }: { content: string }) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");
    // 使用事務來確保貼文和閉包表一起創建
    const comment = await prisma.$transaction(async (tx) => {
      // 1. 創建新貼文
      const newComment = await tx.comment.create({
        data: {
          content,
          authorId: userId,
          isRoot: true, // 標記為頂層貼文
          images: [], // 初始化空的圖片數組
        },
      });

      // 2. 創建指向自身的閉包表記錄 (深度 0)
      await tx.commentClosure.create({
        data: {
          ancestorId: newComment.id,
          descendantId: newComment.id,
          depth: 0,
        },
      });

      return newComment;
    });
    revalidatePath("/home");
    return { success: true, commentId: comment.id };
  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      success: false,
      error: `Failed to create comment`,
    };
  }
}

// 獲取內容 (貼文或留言)
export async function getContent(id: string, userTagName: string) {
  // // 獲取內容基本信息
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
    redirect(`/${userTagName}`);
  }
  try {
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
            NOT: {
              depth: 0,
            },
          },
          include: {
            descendant: {
              select: {
                author: {
                  select: {
                    id: true,
                    username: true,
                    imageUrl: true,
                  },
                },
              },
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
      orderBy: {
        createdAt: "desc",
      },
    });
    // console.log("@", replies);
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
            _count: {
              select: {
                likes: true,
                descendants: true,
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
        })
      : [];

    // 返回結構化內容
    return {
      type: content.isRoot ? "post" : "comment",
      content: contentWithCounts,
      replies: repliesWithCounts,
      replyCount: replies.length,
      likeCount: content.likes.length,
      ancestors: ancestors.map((ancestor) => ({
        ...ancestor,
        replyCount: ancestor.descendants.length,
        likeCount: ancestor.likes.length,
      })),
    };
  } catch (error) {
    console.error("Error getting content:", error);
    return {
      type: "error",
      content: null,
      replies: [],
      replyCount: 0,
      likeCount: 0,
      error: `Failed to get content`,
    };
  }
}
export async function findRootPostOptimized(commentId: string) {
  try {
    // 直接查詢與該留言關聯的、標記為 isRoot 的祖先
    // 在 Closure Table 中，這是一個高效查詢
    const rootPost = await prisma.comment.findFirst({
      where: {
        isRoot: true,
        descendants: {
          some: {
            descendantId: commentId,
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

    return rootPost
      ? {
          ...rootPost,
          likeCount: rootPost.likes.length,
          replyCount: rootPost.descendants.length,
          _count: rootPost._count,
          descendants: rootPost.descendants,
        }
      : null;
  } catch (error) {
    console.error("Error finding root post:", error);
    return null;
  }
}

export async function toggleLike(commentId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("User not found");

    // check if like exists
    const existingLike = await prisma.like.findFirst({
      where: {
        commentId,
        userId,
      },
    });

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) throw new Error("Comment not found");

    if (existingLike) {
      // delete like
      await prisma.like.delete({
        where: {
          commentId_userId: {
            commentId,
            userId,
          },
        },
      });
    } else {
      // like and create notification (only if user is not the author of the post)
      await prisma.$transaction([
        prisma.like.create({
          data: {
            commentId,
            userId,
          },
        }),
        ...(comment.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  userId: comment.authorId,
                  commentId,
                  type: "LIKE",
                  creatorId: userId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to toggle like" };
  }
}

// 創建回覆
export async function createReply({
  parentId,
  content,
}: {
  parentId: string;
  content: string;
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
    return {
      success: false,
      error: `Failed to create reply`,
    };
  }
}

export async function deleteComment(
  commentId: string,
  pathToRevalidate: string = "/"
) {
  try {
    const userId = await getDbUserId();

    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        authorId: true,
      },
    });

    if (!comment) throw new Error("Comment not found");
    if (comment.authorId !== userId) throw new Error("You are not the author");

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
    revalidatePath(pathToRevalidate);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to delete comment" };
  }
}
