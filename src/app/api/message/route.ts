import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { messageId, images } = await request.json();
  if (!messageId || !images) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { images: true },
  });
  if (!message) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }
  await prisma.message.update({
    where: { id: messageId },
    data: { images: [...message.images, ...images] },
  });
  return NextResponse.json({ success: true });
}
