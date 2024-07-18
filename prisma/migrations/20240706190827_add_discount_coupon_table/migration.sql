/*
  Warnings:

  - Added the required column `discountCouponId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "discountCouponId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "discountCoupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountAmount" INTEGER NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "limit" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isAvailableForAllProducts" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discountCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductTodiscountCoupon" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "discountCoupon_code_key" ON "discountCoupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductTodiscountCoupon_AB_unique" ON "_ProductTodiscountCoupon"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductTodiscountCoupon_B_index" ON "_ProductTodiscountCoupon"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountCouponId_fkey" FOREIGN KEY ("discountCouponId") REFERENCES "discountCoupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTodiscountCoupon" ADD CONSTRAINT "_ProductTodiscountCoupon_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductTodiscountCoupon" ADD CONSTRAINT "_ProductTodiscountCoupon_B_fkey" FOREIGN KEY ("B") REFERENCES "discountCoupon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
