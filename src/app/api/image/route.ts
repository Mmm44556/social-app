import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "@/app/actions/user.action";
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (_, payload) => {
        // 檢查用戶是否已登入
        const dbUserId = await getDbUserId();

        if (!dbUserId) {
          throw new Error(
            "Unauthorized: User must be logged in to upload files"
          );
        }

        // 生成上傳 token
        return {
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: dbUserId, // 確保 userId 是 string 型別
            clientPayload: payload,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // 獲取上傳完成的通知

        try {
          // console.log("blob upload completed", blob, tokenPayload);
          // 解析 token payload 中的用戶 ID
          const { dbUserId, clientPayload } = JSON.parse(
            tokenPayload as string
          );

          // 上傳貼文圖片
          if (clientPayload.startsWith("comment")) {
            const commentId = clientPayload.split("/")[1];
            const commentImages = await prisma.comment.findUnique({
              where: { id: commentId },
              select: {
                images: true,
              },
            });
            if (!commentImages) {
              console.log("comment not found");
              return;
            }

            await prisma.comment.update({
              where: { id: commentId },
              data: { images: [...commentImages.images, blob.url] },
            });
          }
          // 上傳背景照片
          if (clientPayload.startsWith("profile")) {
            const userId = clientPayload.split("/")[1];
            await prisma.user.update({
              where: { id: userId },
              data: { imageUrl: blob.url },
            });
          }
          // 上傳頭像
          if (clientPayload.startsWith("avatar")) {
            await prisma.user.update({
              where: { id: dbUserId },
              data: { avatarUrl: blob.url },
            });
          }
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;
  if (!urlToDelete) {
    return NextResponse.json({ error: "No url to delete" }, { status: 400 });
  }
  try {
    await del(urlToDelete);
    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
