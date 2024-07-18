'use server'

import prisma from "@/db/prismaClient"

export default async function userOrderExists(productId: string, email: string) {
  const order = await prisma.order.findFirst({
    where: {
      productId,
      user: {
        email
      }
    },
    select: {
      id: true
    }
  })

  return order !== null
}