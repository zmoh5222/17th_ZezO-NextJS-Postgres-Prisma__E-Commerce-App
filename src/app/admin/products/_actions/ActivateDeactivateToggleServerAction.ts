'use server'

import prisma from "@/db/prismaClient"
import serverActionCatchError from "@/lib/serverActionCatchErrors"

export default async function ActivateDeactivateToggleServerAction(id: string, isAvailableForPurchase: boolean) {
  try {
    await prisma.product.update({
      where: {
        id
      },
      data: {
        isAvailableForPurchase: !isAvailableForPurchase
      }
    })
  
    return {
      ok: true,
      data: 'toggle product done successfully'
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}