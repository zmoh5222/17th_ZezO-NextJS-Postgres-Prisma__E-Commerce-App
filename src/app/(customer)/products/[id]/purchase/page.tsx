import Stripe from 'stripe'
import prisma from "@/db/prismaClient"
import { notFound } from 'next/navigation'
import CheckoutForm from './_components/CheckoutForm'

export default async function ProductPurchasePage({params: {id}, searchParams: {coupon}}: {params: {id: string}, searchParams: {coupon: string}}) {
  // get product
  const product = await prisma.product.findUnique({
    where: {
      id
    }
  })
  
  if (!product) return notFound()

  let couponData = undefined
  if (coupon) {
    couponData = await prisma.discountCoupon.findUnique({
      where: {
        code: coupon.toUpperCase(),
        isActive: true,

        AND: [
          {OR: [{expiresAt: null}, {expiresAt: {gt: new Date()}}]},
          {OR: [{limit: null}, {limit: {gt: prisma.discountCoupon.fields.uses}}]},
          {OR: [{isAvailableForAllProducts: true}, {products: {some: {id: product.id}}}]}
        ]
      },
      select: {
        id: true,
        discountType: true,
        discountAmount: true
      }
    })
  }

  return (
    <CheckoutForm 
    product={product} couponData={couponData} />
  )
}