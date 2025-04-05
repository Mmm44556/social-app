/*
  Warnings:

  - You are about to drop the column `parentId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropIndex
DROP INDEX "Comment_parentId_idx";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "parentId";

-- CreateTable
CREATE TABLE "CommentClosure" (
    "id" TEXT NOT NULL,
    "ancestorId" TEXT NOT NULL,
    "descendantId" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,

    CONSTRAINT "CommentClosure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommentClosure_ancestorId_idx" ON "CommentClosure"("ancestorId");

-- CreateIndex
CREATE INDEX "CommentClosure_descendantId_idx" ON "CommentClosure"("descendantId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentClosure_ancestorId_descendantId_key" ON "CommentClosure"("ancestorId", "descendantId");

-- AddForeignKey
ALTER TABLE "CommentClosure" ADD CONSTRAINT "CommentClosure_ancestorId_fkey" FOREIGN KEY ("ancestorId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentClosure" ADD CONSTRAINT "CommentClosure_descendantId_fkey" FOREIGN KEY ("descendantId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
