'use server'

import fs from 'fs/promises'
import prisma from "@/db/prismaClient"
import serverActionCatchError from '@/lib/serverActionCatchErrors'
import addProductSchema from '../_validation/addProductSchema'

export default async function addProductAction(previousState: unknown, formData: FormData) {
  // convert fomData to normal object
  const newProductInputs = Object.fromEntries(formData.entries())

  // validation
  const validation = addProductSchema.safeParse(newProductInputs)

  if (!validation.success) {
    return {
      ok: false,
      error: validation.error?.formErrors.fieldErrors
    }
  }

  const { name, price, description, file, image } = validation.data

  await fs.mkdir('products', {recursive: true})
  const filePath = `products/${crypto.randomUUID()}-${file.name}`
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()))

  await fs.mkdir('public/products', {recursive: true})
  const imagePath = `/products/${crypto.randomUUID()}-${image.name}`
  await fs.writeFile(`public${imagePath}`, Buffer.from(await image.arrayBuffer()))
  // create product
  try {
    await prisma.product.create({
      data: {
        name,
        price,
        description,
        filePath,
        imagePath
      }
    })
  } catch (err) {
    // delete file and image if create product failed
    await fs.unlink(filePath)
    await fs.unlink(`public${imagePath}`)

    // return error
    const error = serverActionCatchError(err)
    return error
  }

  return {
    ok: true
  }

}