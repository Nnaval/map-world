/*
  Warnings:

  - You are about to drop the column `occupied` on the `Shop` table. All the data in the column will be lost.
  - Made the column `kingdom` on table `Shop` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Shop" DROP COLUMN "occupied",
ALTER COLUMN "size" SET DEFAULT 0.007,
ALTER COLUMN "kingdom" SET NOT NULL;
