'use server'

import prisma from "@/db/prismaClient"
import serverActionCatchError from "@/lib/serverActionCatchErrors"
import { notFound } from "next/navigation"

export default async function deleteCouponServerAction(id: string) {
  try {
    const coupon = await prisma.discountCoupon.delete({
      where: {
        id
      }
    })
    if (!coupon) {
      return notFound()
    }
  
    return {
      ok: true,
      data: 'coupon deleted successfully'
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}