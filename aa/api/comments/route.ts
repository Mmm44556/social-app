import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/comments?postId={postId}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        isDeleted: false,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true,
          },
        },
        likes: true,
        descendants: {
          where: {
            depth: 1,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { content, postId, parentCommentId, images } = json;

    if (!content || !postId) {
      return NextResponse.json(
        { error: "Content and post ID are required" },
        { status: 400 }
      );
    }

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the comment
      const comment = await prisma.comment.create({
        data: {
          content,
          postId,
          authorId: user.id,
          images: images || [],
        },
      });

      // If this is a reply to another comment
      if (parentCommentId) {
        // Create self-referential closure
        await prisma.commentClosure.create({
          data: {
            ancestorId: comment.id,
            descendantId: comment.id,
            depth: 0,
          },
        });

        // Create closure with parent
        await prisma.commentClosure.create({
          data: {
            ancestorId: parentCommentId,
            descendantId: comment.id,
            depth: 1,
          },
        });

        // Copy all parent's ancestors to new comment
        await prisma.$executeRaw`
          INSERT INTO "CommentClosure" ("id", "ancestorId", "descendantId", "depth")
          SELECT gen_random_uuid(), "ancestorId", ${comment.id}, "depth" + 1
          FROM "CommentClosure"
          WHERE "descendantId" = ${parentCommentId}
          AND "ancestorId" != "descendantId"
        `;

        // Create notification for parent comment author
        const parentComment = await prisma.comment.findUnique({
          where: { id: parentCommentId },
          select: { authorId: true },
        });

        if (parentComment?.authorId && parentComment.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              type: "COMMENT",
              userId: parentComment.authorId,
              creatorId: user.id,
              commentId: comment.id,
              postId,
            },
          });
        }
      } else {
        // Create self-referential closure for root comment
        await prisma.commentClosure.create({
          data: {
            ancestorId: comment.id,
            descendantId: comment.id,
            depth: 0,
          },
        });

        // Create notification for post author
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { authorId: true },
        });

        if (post?.authorId && post.authorId !== user.id) {
          await prisma.notification.create({
            data: {
              type: "COMMENT",
              userId: post.authorId,
              creatorId: user.id,
              commentId: comment.id,
              postId,
            },
          });
        }
      }

      return comment;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
