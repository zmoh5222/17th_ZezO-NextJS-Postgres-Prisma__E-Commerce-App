'use server'

import prisma from "@/db/prismaClient"
import sendEmailSchema from "../_validation/sendEmailSchema"
import { Resend } from "resend"
import OrdersHistoryEmail from "@/components/email/OrdersHistory"

export default async function getUserOrdersServerAction(prevState: unknown, formData: FormData): Promise<{message?: string, error?: string} | undefined> {
  const validation = sendEmailSchema.safeParse(formData.get('email'))
  if (!validation.success) {
    return {
      error: 'invalid email address'
    }
  }

  const email = validation.data

  // get user orders with products
  const user = await prisma.user.findUnique({
    where: {email},
    select: {
      orders: {
        select: {
          id: true,
          paidPrice: true,
          createdAt: true,
          product: {
            select: {
              id: true,
              name: true,
              description: true,
              imagePath: true
            }
          }
        }
      }
    }
  })

  // for security throw an success message if email not found
  if (!user) {
    return {
      message: 'check you email address'
    }
  }

  try {
    await prisma.$transaction(async (prisma) => {
      // create download verification
      const orders = await Promise.all(user.orders.map(async (order) => {
        const downloadVerification = await prisma.downloadVerification.create({
          data: {
            productId: order.product.id,
            expiredAt: new Date(Date.now() + Number(process.env.DOWNLOAD_VERIFICATION_EXPIRATION_TIME))
          },
          select: {
            id: true
          }
        });

        return {
          order: {
            id: order.id,
            paidPrice: order.paidPrice,
            createdAt: order.createdAt,
          },
          product: order.product,
          downloadVerificationId: downloadVerification.id
        };
      }));

      // send order history emails
      const resend = new Resend(process.env.RESEND_API_SECRET_KEY);
      const emails = await resend.emails.send({
        from: `Support <${process.env.RESEND_EMAIL}>`,
        to: email,
        subject: 'Orders History',
        react: <OrdersHistoryEmail orders={orders} />
      });
      
      if (emails.error) {
        throw Error(emails.error.message)
      }
    });

    return {
      message: 'Orders processed and email sent successfully.'
    }

  } catch (error) {
    if (error instanceof Error)
    return {
      error: process.env.NODE_ENV === 'development' ? error.message : 'something went wrong, try again later'
    }
  }

}