'use server'

import prisma from "@/db/prismaClient"
import getDiscountedAmount from "@/lib/getDiscountedAmount"
import Stripe from "stripe"

export default async function createPaymentIntentAction(email: string, productId: string, discountCouponId?: string, ) {
  // get product that will be purchased
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    select: {
      id: true,
      price: true
    }
  })
  
  if (!product) return {
    error: 'something went wrong, try again later'
  }

  // check if user already purchased item before
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

  if (order) {
    return {
      error: 'you have already purchased this item before, you can download it from your orders page'
    }
  }

  // get discount coupon and apply it if exists
  const discountCoupon = !discountCouponId ? null : (
    await prisma.discountCoupon.findUnique({
      where: {
        id: discountCouponId,
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
  )

  if (discountCouponId && discountCoupon === null) {
    return {
      error: 'Invalid or Expired code'
    }
  }

  let amount = product.price
  if (discountCoupon) {
    amount = getDiscountedAmount(discountCoupon.discountType, discountCoupon.discountAmount, product.price)
  }

  // create paymentIntent
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'USD',
    metadata: {
      productId: product.id,
      discountCouponId: discountCoupon?.id || null
    }
  })
  if (!paymentIntent.client_secret) {
    return {
      error: 'failed to create payment intent'
    }
  }

  return {
    clientSecret: paymentIntent.client_secret
  }
}