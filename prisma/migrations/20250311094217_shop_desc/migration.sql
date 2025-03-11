/*
  Warnings:

  - Made the column `description` on table `ShopItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ShopItem" ALTER COLUMN "description" SET NOT NULL;
