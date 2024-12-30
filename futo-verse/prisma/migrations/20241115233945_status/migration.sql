-- DropForeignKey
ALTER TABLE "StoreStatus" DROP CONSTRAINT "StoreStatus_shopId_fkey";

-- AlterTable
ALTER TABLE "StoreStatus" ALTER COLUMN "shopId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "StoreStatus" ADD CONSTRAINT "StoreStatus_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
