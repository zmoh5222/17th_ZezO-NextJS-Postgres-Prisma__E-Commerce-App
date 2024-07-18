'use server'

import prisma from "@/db/prismaClient"
import serverActionCatchError from "@/lib/serverActionCatchErrors"

export default async function CouponActivateDeactivateToggleServerAction(id: string, isActive: boolean) {
  try {
    await prisma.discountCoupon.update({
      where: {
        id
      },
      data: {
        isActive: !isActive
      }
    })
  
    return {
      ok: true,
      data: 'Toggle coupon done successfully'
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}