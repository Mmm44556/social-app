import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { del, list, head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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
          // 解析 token payload 中的用戶 ID
          const { clientPayload } = JSON.parse(tokenPayload as string);
          // 上傳貼文圖片
          if (blob.pathname.startsWith("comments")) {
            const commentId = clientPayload;
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
          if (blob.pathname.startsWith("profile")) {
            const userId = clientPayload.split("/")[1];
            await prisma.user.update({
              where: { id: userId },
              data: { imageUrl: blob.url },
            });
          }
          // 上傳頭像
          if (blob.pathname.startsWith("avatar")) {
            const userId = clientPayload;
            await prisma.user.update({
              where: { id: userId },
              data: { avatarUrl: blob.url },
            });
          }
        } catch (error) {
          console.log(error, "error");
          throw new Error("Could not update user");
        }
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;
  const folderToDelete = searchParams.get("folder") as string;

  if (!urlToDelete && !folderToDelete) {
    return NextResponse.json(
      { error: "No url or folder to delete" },
      { status: 400 }
    );
  }

  try {
    if (folderToDelete) {
      // 列出資料夾中的所有檔案
      const { blobs } = await list({
        prefix: folderToDelete,
      });

      // 刪除所有找到的檔案
      await Promise.all(blobs.map((blob) => del(blob.url)));

      return NextResponse.json({ status: 200 });
    }

    // 刪除單一檔案
    await del(urlToDelete.split(","));
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error, "error");
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") as string;
  const metadata = await head(url);
  return NextResponse.json(metadata);
}
