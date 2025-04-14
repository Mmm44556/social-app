import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname) => {
        // 檢查用戶是否已登入
        const { userId: clerkId } = await auth();

        if (!clerkId) {
          throw new Error(
            "Unauthorized: User must be logged in to upload files"
          );
        }

        // 生成上傳 token
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/gif"],
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({
            userId: clerkId as string, // 確保 userId 是 string 型別
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // 獲取上傳完成的通知
        console.log("blob upload completed", blob, tokenPayload);

        try {
          // 解析 token payload 中的用戶 ID
          const { clerkId } = JSON.parse(tokenPayload as string);

          // 這裡可以添加額外的邏輯，例如更新用戶的頭像等
          await prisma.user.update({
            where: { clerkId: clerkId },
            data: { imageUrl: blob.url },
          });
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
