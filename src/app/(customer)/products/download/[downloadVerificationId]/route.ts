import fs from 'fs/promises'
import path from 'path';
import prisma from "@/db/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, {params: {downloadVerificationId}}: {params: {downloadVerificationId: string}}) {
  const data = await prisma.downloadVerification.findUnique({
    where: {
      id: downloadVerificationId,
      expiredAt: {
        gt: new Date()
      }
    },
    select: {
      product: {
        select: {
          filePath: true
        }
      }
    }
  })

  if (!data) {
    return NextResponse.redirect(new URL("/products/download/expired", req.url))
  }

  // get file need to be downloaded
  const file = await fs.readFile(data.product.filePath)
  const { size } = await fs.stat(data.product.filePath)
  const { name, ext } = path.parse(data.product.filePath)

  return new NextResponse(file, {
    headers: {
      'Content-Disposition': `attachment; filename=${name}${ext}`,
      'Content-Length': size.toString()
    }
  })
}