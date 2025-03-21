-- DropForeignKey
ALTER TABLE "ShopItem" DROP CONSTRAINT "ShopItem_shopId_fkey";

-- AlterTable
ALTER TABLE "ShopItem" ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "shopId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ShopItem" ADD CONSTRAINT "ShopItem_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopItem" ADD CONSTRAINT "ShopItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
