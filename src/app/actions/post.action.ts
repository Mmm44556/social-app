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
