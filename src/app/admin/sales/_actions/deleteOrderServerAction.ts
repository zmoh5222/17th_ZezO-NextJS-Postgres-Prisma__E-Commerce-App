'use server'

import prisma from "@/db/prismaClient"
import serverActionCatchError from "@/lib/serverActionCatchErrors"
import { notFound } from "next/navigation"

export default async function deleteOrderServerAction(id: string) {
  try {
    const order = await prisma.order.delete({
      where: {
        id
      }
    })

    if (!order) {
      return notFound()
    }
  
    return {
      ok: true,
      data: 'order deleted successfully'
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}