/*
  Warnings:

  - You are about to drop the column `postId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `Share` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tagName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentId` to the `Share` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'TAG';

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_postId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Share" DROP CONSTRAINT "Share_postId_fkey";

-- DropIndex
DROP INDEX "Comment_postId_idx";

-- DropIndex
DROP INDEX "Like_postId_idx";

-- DropIndex
DROP INDEX "Like_postId_userId_key";

-- DropIndex
DROP INDEX "Share_postId_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "postId",
ADD COLUMN     "isRoot" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "postId";

-- AlterTable
ALTER TABLE "Share" DROP COLUMN "postId",
ADD COLUMN     "commentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tagName" TEXT NOT NULL;

-- DropTable
DROP TABLE "Post";

-- CreateIndex
CREATE INDEX "Comment_isRoot_idx" ON "Comment"("isRoot");

-- CreateIndex
CREATE INDEX "Share_commentId_idx" ON "Share"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_tagName_key" ON "User"("tagName");

-- CreateIndex
CREATE INDEX "User_tagName_idx" ON "User"("tagName");

-- AddForeignKey
ALTER TABLE "Share" ADD CONSTRAINT "Share_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
