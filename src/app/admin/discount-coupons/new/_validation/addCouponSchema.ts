import { DiscountType } from "@prisma/client"
import { z } from "zod"


const addCouponSchema = z.object({
  code: z.string().min(1, {message: 'code is required'}).toUpperCase(),
  discountType: z.nativeEnum(DiscountType),
  discountAmount: z.coerce.number().min(1, {message: 'discount amount is required'}).int(),
  limit: z.preprocess(value => value ? value : undefined, z.coerce.number().int().optional()),
  expiresAt: z.preprocess(value => value ? value : undefined, z.coerce.date().min(new Date()).optional()),
  allProducts: z.coerce.boolean(),
  productIds: z.array(z.string()).optional(),
})
.refine(field => !(field.discountType === "PERCENTAGE" && field.discountAmount > 100), {
  message: 'percentage value cannot be greater than 100',
  path: ['discountAmount']
})
.refine(field => !(!field.allProducts && !field.productIds?.length), {
  message: 'you must select allProducts or other specified products',
  path: ['allProducts', 'productIds']
})
.refine(field => !(field.allProducts && field.productIds?.length), {
  message: 'you can only select allProducts or other specified products not both of them',
  path: ['allProducts', 'productIds']
})

export default addCouponSchema