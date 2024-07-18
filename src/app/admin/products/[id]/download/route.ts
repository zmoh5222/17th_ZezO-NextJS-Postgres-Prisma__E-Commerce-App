import fs from 'fs/promises'
import path from 'path'
import prisma from "@/db/prismaClient";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params: {id}}:{params: {id: string}}) {
  const product = await prisma.product.findUnique({
    where: {id}
  })

  if (!product) {
    return notFound()
  }

  // get file need to be downloaded
  const file = await fs.readFile(product.filePath)
  const { size } = await fs.stat(product.filePath)
  const { name, ext } = path.parse(product.filePath)

  return new NextResponse(file, {
    headers: {
      'Content-Disposition': `attachment; filename=${name}${ext}`,
      'Content-Length': size.toString()
    }
  })
}