'use server'

import serverActionCatchError from "@/lib/serverActionCatchErrors"
import addCouponSchema from "../_validation/addCouponSchema"
import prisma from "@/db/prismaClient"

export default async function addCouponAction(previousState: unknown, formData: FormData) {
  const productIdsCouponInput = formData.getAll('productIds')
  const couponInputs = Object.fromEntries(formData.entries())
  const allCouponInputs = {
    ...couponInputs,
    productIds: productIdsCouponInput ? productIdsCouponInput : undefined
  }

  // validation
  const validation = addCouponSchema.safeParse(allCouponInputs)

  if (!validation.success) {
    return {
      ok: false,
      error: validation.error?.formErrors.fieldErrors
    }
  }

  const { code, discountType, discountAmount, limit, expiresAt, allProducts, productIds } = validation.data

  // create array of objects from productIds to use it with connect while creating coupon
  const connectProductsIDS = productIds?.length ? productIds?.map(id => {
    return {
      id
    }
  }) : undefined

  // create product
  try {
    await prisma.discountCoupon.create({
      data: {
        code,
        discountType,
        discountAmount,
        limit,
        expiresAt,
        isAvailableForAllProducts: allProducts,
        products: {
          connect: connectProductsIDS
        }
      }
    })
  } catch (err) {
    // mainly for unique coupon error
    if (err instanceof Error && err.message.includes('Unique constraint failed on the fields: (`code`)')) {
      return {
        ok: false,
        error: {
          message: 'Coupon already exists!'
        }
      }
    }
    const error = serverActionCatchError(err)
    return error
  }

  return {
    ok: true
  }
}