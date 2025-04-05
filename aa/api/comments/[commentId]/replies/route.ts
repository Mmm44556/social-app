import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/comments/[commentId]/replies
export async function GET(
  request: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    const { commentId } = params;

    const replies = await prisma.comment.findMany({
      where: {
        ancestors: {
          some: {
            ancestorId: commentId,
            depth: 1,
          },
        },
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

    return NextResponse.json(replies);
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
