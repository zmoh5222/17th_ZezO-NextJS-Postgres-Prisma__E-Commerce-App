'use server'

import fs from 'fs/promises'
import prisma from "@/db/prismaClient"
import { notFound } from "next/navigation"
import serverActionCatchError from '@/lib/serverActionCatchErrors'

export default async function deleteProductServerAction(id: string) {
  try {
    const product = await prisma.product.delete({
      where: {
        id
      }
    })

    if (!product) {
      return notFound()
    }
  
    // delete related file and image
    await fs.unlink(product.filePath)
    await fs.unlink(`public${product.imagePath}`)
  
    return {
      ok: true,
      data: 'product deleted successfully'
    }
  } catch (err) {
    const error = serverActionCatchError(err)
    return error
  }
}