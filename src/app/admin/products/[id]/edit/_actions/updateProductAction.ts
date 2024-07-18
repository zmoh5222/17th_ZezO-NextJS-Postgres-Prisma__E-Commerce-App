'use server'

import fs from 'fs/promises'
import prisma from "@/db/prismaClient"
import updateProductSchema from "../_validation/updateProductSchema"
import { notFound } from "next/navigation"
import serverActionCatchError from '@/lib/serverActionCatchErrors'
import { revalidatePath } from 'next/cache'

export default async function updateProductAction(id: string, previousState: unknown, formData: FormData) {
  // convert fomData to normal object
  const newProductInputs = Object.fromEntries(formData.entries())

  // validation
  const validation = updateProductSchema.safeParse(newProductInputs)

  if (!validation.success) {
    return {
      ok: false,
      error: validation.error?.formErrors.fieldErrors
    }
  }
  
  const { name, price, description, file, image } = validation.data

  // check if product is exists
  const product = await prisma.product.findUnique({
    where: {id}
  })

  if (!product) {
    return notFound()
  }

  let filePath = undefined
  if (file.size > 0) {
    filePath = `products/${crypto.randomUUID()}-${file.name}`
    await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))
  }

  let imagePath = undefined
  if (image.size > 0) {
    imagePath = `/products/${crypto.randomUUID()}-${image.name}`
    await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()))
  }

  // update product
  try {
    const updatedProduct = await prisma.product.update({
      where: {id},
      data: {
        name,
        price,
        description,
        filePath,
        imagePath
      }
    })

    // delete old files if update done successfully
    if (updatedProduct && filePath) await fs.unlink(product.filePath)
    if (updatedProduct && imagePath) await fs.unlink(`public${product.imagePath}`)
  } catch (err) {
    if (filePath) await fs.unlink(filePath)
    if (imagePath) await fs.unlink(`public${imagePath}`)

    // return error
    const error = serverActionCatchError(err)
    return error
  }

  return {
    ok: true
  }

}