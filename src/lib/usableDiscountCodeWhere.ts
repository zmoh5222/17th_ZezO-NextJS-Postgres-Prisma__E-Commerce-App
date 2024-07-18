import prisma from "@/db/prismaClient";
import { Prisma } from "@prisma/client";

export default function usableDiscountCodeWhere(productId: string) {
  return {
    isActive: true,
    AND: [
      {OR: [{expiresAt: null}, {expiresAt: {gt: new Date()}}]},
      {OR: [{limit: null}, {limit: {gt: prisma.discountCoupon.fields.uses}}]},
      {OR: [{isAvailableForAllProducts: true}, {products: {some: {id: productId}}}]}
    ]
  } satisfies Prisma.discountCouponWhereInput
}