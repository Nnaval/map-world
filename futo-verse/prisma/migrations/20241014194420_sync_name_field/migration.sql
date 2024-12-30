/*
  Warnings:

  - Added the required column `tag` to the `ShopItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "tag" TEXT NOT NULL;
