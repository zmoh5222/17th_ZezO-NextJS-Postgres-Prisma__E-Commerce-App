import PurchaseReceiptEmail from "@/components/email/PurchaseReceipt";
import prisma from "@/db/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: NextRequest) {
  const event = await stripe.webhooks.constructEvent(
    await req.text(), // payload
    req.headers.get('stripe-signature') as string, // stripe-signature header
    process.env.STRIPE_WEBHOOK_SECRET_KEY as string // webhook secret
  )

  if (event.type === 'charge.succeeded') {
    const charge = event.data.object
    const productId = charge.metadata.productId
    const discountCouponId = charge.metadata.discountCouponId
    const email = charge.billing_details.email
    const price = charge.amount

    const product = await prisma.product.findUnique({
      where:{id: productId}
    })
    if (!product || !email) {
      return new NextResponse('Bad Request', {status: 400})
    }

    // create or update user and order
    const {orders: [order]} = await prisma.user.upsert({
      where: {
        email
      },
      create: {
        email,
        orders: {
          create: {
            productId,
            paidPrice: price,
            discountCouponId: discountCouponId ? discountCouponId : undefined
          }
        }
      },
      update: {
        email,
        orders: {
          create: {
            productId,
            paidPrice: price,
            discountCouponId: discountCouponId ? discountCouponId : undefined
          }
        }
      },
      select: {
        orders: {
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            paidPrice: true,
            createdAt: true
          },
          take: 1
        }
      }
    })

    const downloadVerification = await prisma.downloadVerification.create({
      data: {
        productId,
        expiredAt: new Date(Date.now() + Number(process.env.DOWNLOAD_VERIFICATION_EXPIRATION_TIME))
      }
    })

    // decrement discount coupon by 1 if exists and if it have limits applied
    if (discountCouponId) {
      await prisma.discountCoupon.update({
        where: {
          id: discountCouponId,
          limit: {not: null}
        },
        data: {uses: {increment: 1}}
      })
    }

    // sending email
    const resend = new Resend(process.env.RESEND_API_SECRET_KEY)
    await resend.emails.send({
      from: `Support <${process.env.RESEND_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      react: <PurchaseReceiptEmail product={product} order={order} downloadVerificationId={downloadVerification?.id} />
    })
  }
  
  return new NextResponse()
}