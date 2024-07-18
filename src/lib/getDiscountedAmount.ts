import { DiscountType } from "@prisma/client";

export default function getDiscountedAmount(discountType: DiscountType, discountAmount: number, originalPrice: number) {
  switch (discountType) {
    case "PERCENTAGE":
      return Math.max(1, (originalPrice - ((originalPrice * discountAmount) / 100)))
    case "FIXED":
      return Math.max(1, (originalPrice - (discountAmount * 100)))
    default:
      throw new Error(`invalid discount type ${discountType satisfies never}`)
  }
}