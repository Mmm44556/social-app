import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { content, receiverId } = body;

    if (!content || !receiverId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get sender's database ID
    const sender = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!sender) {
      return new NextResponse("Sender not found", { status: 404 });
    }

    // Create message in database
    const message = await prisma.message.create({
      data: {
        content,
        senderId: sender.id,
        receiverId,
      },
      include: {
        sender: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("[CHAT_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("otherUserId");

    if (!otherUserId) {
      return new NextResponse("Missing otherUserId", { status: 400 });
    }

    // Get current user's database ID
    const currentUser = await prisma.user.findUnique({
      where: { clerkId },
      select: { id: true },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
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
            username: true,
            avatarUrl: true,
          },
        },
        receiver: {
          select: {
            username: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[CHAT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
