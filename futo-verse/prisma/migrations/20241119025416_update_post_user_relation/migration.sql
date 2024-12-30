/*
  Warnings:

  - You are about to drop the column `body` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "body",
DROP COLUMN "title",
ADD COLUMN     "media" TEXT,
ADD COLUMN     "text" TEXT;
