import Stripe from 'stripe'
import { currencyFormat } from "@/lib/formaters";
import Image from "next/image";
import prisma from '@/db/prismaClient';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PurchaseSuccessPage({searchParams: {payment_intent}}: {searchParams: {payment_intent: string}}) {
  // get order data
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)
  if (!paymentIntent.metadata.productId) return notFound()

  const isSuccess = paymentIntent.status === 'succeeded'

  // get product data
  const productId = paymentIntent.metadata.productId
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    }
  })
  if (!product) return notFound()

  // create download verification
  const downloadVerification = await prisma.downloadVerification.create({
    data: {
      productId,
      expiredAt: new Date(Date.now() + Number(process.env.DOWNLOAD_VERIFICATION_EXPIRATION_TIME))
    }
  })

  return (
    <div className="max-w-2xl w-full space-y-8">
      <h1 className='text-3xl font-bold'>{isSuccess ? 'Success!' : 'Failed!'}</h1>
      <div className="flex items-center gap-5">
        <div className="relative w-1/3 aspect-video flex-shrink-0">
          <Image src={product.imagePath} fill alt={product.name} className="rounded" />
        </div>
        <div>
          <h3 className="font-bold text-2xl line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground line-clamp-2">{product.description}</p>
          <Button asChild className='mt-3'>
            {
              isSuccess ? (
                <a href={`/products/download/${downloadVerification.id}`}>Download</a>
              ) : (
                <Link href={`/products/${productId}/purchase`}>Try Again</Link>
              )
            }
          </Button>
        </div>
      </div>
    </div>
  )
}