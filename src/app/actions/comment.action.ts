"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

/**
 * 創建頂層留言
 */
export async function createRootComment({
  content,
  imageUrl,
  postId,
}: {
  content: string;
  imageUrl: string[];
  postId: string;
}) {
  try {
    // 驗證必要參數
    if (!content || !postId) {
      return { success: false, error: "缺少必要參數" };
    }
    const authorId = await getDbUserId();
    if (!authorId) throw new Error("User not found");
    // 使用事務來確保留言和閉包表一起創建
    const comment = await prisma.$transaction(async (tx) => {
      // 1. 創建新留言
      const newComment = await tx.comment.create({
        data: {
          content,
          images: imageUrl || [],
          postId,
          authorId,
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
    return { success: true, comment };
  } catch (error) {
    console.error("創建留言失敗:", error);
    return { success: false, error: "Failed to create comment" };
  }
}

/**
 * 創建回覆留言
 */
export async function createReplyComment({
  content,
  images,
  postId,
  parentId,
}: {
  content: string;
  images: string[];
  postId: string;
  parentId: string;
}) {
  try {
    const authorId = await getDbUserId();
    if (!authorId) throw new Error("User not found");

    // 驗證必要參數
    if (!content || !postId || !parentId) {
      return { success: false, error: "缺少必要參數" };
    }

    // 檢查父留言是否存在
    const parentComment = await prisma.comment.findUnique({
      where: { id: parentId },
    });

    if (!parentComment) {
      return { success: false, error: "父留言不存在" };
    }

    // 使用事務來確保所有操作一起完成
    const comment = await prisma.$transaction(async (tx) => {
      // 1. 創建新留言
      const newComment = await tx.comment.create({
        data: {
          content,
          images: images || [],
          postId,
          authorId,
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

      // 3. 獲取父留言的所有祖先記錄
      const parentClosures = await tx.commentClosure.findMany({
        where: {
          descendantId: parentId,
        },
      });

      // 4. 為每個祖先創建與新留言的關係
      const closurePromises = parentClosures.map((closure) =>
        tx.commentClosure.create({
          data: {
            ancestorId: closure.ancestorId,
            descendantId: newComment.id,
            depth: closure.depth + 1,
          },
        })
      );

      await Promise.all(closurePromises);
      revalidatePath(`/home/${postId}`);
      return newComment;
    });

    return { success: true, comment };
  } catch (error) {
    console.error("創建回覆留言失敗:", error);
    return { success: false, error: "創建回覆留言失敗" };
  }
}

/**
 * 獲取貼文的所有頂層留言
 */
export async function getRootComments({
  postId,
  limit = 10,
  cursor,
}: {
  postId: string;
  limit?: number;
  cursor?: string;
}) {
  try {
    if (!postId) {
      return { success: false, error: "缺少貼文ID" };
    }

    // 查詢條件
    const where = {
      postId: postId as string,
    };

    // 分頁查詢
    const pagination = cursor
      ? {
          cursor: {
            id: cursor as string,
          },
          skip: 1, // 跳過cursor指向的項目
        }
      : null;

    // 查詢所有直接屬於貼文的頂層留言
    // 頂層留言是那些在 CommentClosure 中只有深度為 0 的記錄的留言
    const topLevelComments = await prisma.comment.findMany({
      where: {
        ...where,
        ancestors: {
          every: {
            depth: 0, // 只選擇沒有非零深度祖先的留言
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
            _count: {
              select: {
                followers: true,
                likes: true,
              },
            },
          },
        },
        // 包含留言的直接回覆數量
        descendants: {
          where: {
            depth: 1, // 只計算深度為1的記錄，即直接子留言
          },
        },
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: Number(limit),
      ...(pagination || {}),
    });

    // 處理每個留言的回覆計數
    const commentsWithCounts = topLevelComments.map((comment) => ({
      ...comment,
      replyCount: comment.descendants.length,
      likeCount: comment.likes.length,
      descendants: undefined, // 移除 descendants 陣列，只保留計數
    }));

    // 取得下一個游標
    const nextCursor =
      commentsWithCounts.length === Number(limit)
        ? commentsWithCounts[commentsWithCounts.length - 1].id
        : null;

    return {
      success: true,
      comments: commentsWithCounts,
      nextCursor,
    };
  } catch (error) {
    console.error("獲取頂層留言失敗:", error);
    return { success: false, error: "獲取頂層留言失敗" };
  }
}
