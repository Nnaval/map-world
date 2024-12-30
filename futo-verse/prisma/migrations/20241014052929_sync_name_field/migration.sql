/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Shop" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Shop_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Shop_name_key" ON "Shop"("name");
