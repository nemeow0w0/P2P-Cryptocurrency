/*
  Warnings:

  - You are about to drop the column `createdAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `assetId` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `buyOrderId` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `sellOrderId` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `trades` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fiatId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerId` to the `trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `trades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `trades` table without a default value. This is not possible if the table is not empty.
  - The required column `walletAddress` was added to the `wallets` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_assetId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_assetId_fkey";

-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_buyOrderId_fkey";

-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_sellOrderId_fkey";

-- DropForeignKey
ALTER TABLE "trades" DROP CONSTRAINT "trades_userId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "fiatId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "trades" DROP COLUMN "assetId",
DROP COLUMN "buyOrderId",
DROP COLUMN "sellOrderId",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "buyerId" INTEGER NOT NULL,
ADD COLUMN     "orderId" INTEGER NOT NULL,
ADD COLUMN     "sellerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "wallets" ADD COLUMN     "walletAddress" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "transfers" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER,
    "assetId" INTEGER NOT NULL,
    "amount" DECIMAL(20,8) NOT NULL,
    "type" TEXT NOT NULL,
    "externalAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallets_walletAddress_key" ON "wallets"("walletAddress");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
