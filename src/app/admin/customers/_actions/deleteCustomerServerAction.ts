'use server'

import prisma from "@/db/prismaClient"
import serverActionCatchError from "@/lib/serverActionCatchErrors"
import { notFound } from "next/navigation"

export default async function deleteCustomerServerAction(id: string) {
  try {
    const user = await prisma.user.delete({
      where: {
        id
      }
    })

    if (!user) {
      return notFound()
    }
  
    return {
      ok: true,
      data: 'customer deleted successfully'
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}