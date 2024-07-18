'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { currencyFormat, percentNumberFormat } from "@/lib/formaters"
import { DiscountType, Product } from "@prisma/client"
import { Elements, LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from '@stripe/stripe-js'
import { LoaderPinwheel } from "lucide-react"
import Image from "next/image"
import { FormEvent, useRef, useState } from "react"
import userOrderExists from "../_actions/userOrderExists"
import { AlertCard } from "@/components/AlertCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import createPaymentIntentAction from "../_actions/createPaymentIntentAction"
import getDiscountedAmount from "@/lib/getDiscountedAmount"

type CheckoutFormProps = {
  product: Product
  couponData?: {
    id: string
    discountType: DiscountType
    discountAmount: number
  } | null
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

export default function CheckoutForm({product, couponData}: CheckoutFormProps) {

  let amount = product.price
  if (couponData) {
    amount = getDiscountedAmount(couponData?.discountType, couponData?.discountAmount, product.price)
  }

  return (
    <div className="max-w-2xl w-full space-y-8">
      <div className="flex items-center gap-5">
        <div className="relative w-1/3 aspect-video flex-shrink-0">
          <Image src={product.imagePath} fill alt={product.name} className="rounded" />
        </div>
        <div>
          <div>
          {
            couponData && (
              <span className="text-red-500 font-bold line-through me-2">{currencyFormat(product.price / 100)}</span>
            )
          }
            <span className="text-blue-500 font-bold">{currencyFormat(amount / 100)}</span>
          </div>
          <h3 className="font-bold text-2xl line-clamp-1">{product.name}</h3>
          <p className="text-muted-foreground line-clamp-3">{product.description}</p>
        </div>
      </div>
      <Elements stripe={stripePromise}
        options={{amount: amount, mode: "payment", currency: 'usd'}}
        >
        <Form price={amount / 100} productId={product.id} couponData={couponData} />
      </Elements>
    </div>
  )
}

function Form({price, productId, couponData}: {price: number, productId: string, couponData?: {id: string, discountType: DiscountType, discountAmount: number} | null}) {
  const stripe = useStripe()
  const elements = useElements()

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const purchaseProductHandler = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !email) return
    setIsLoading(true)

    const stripeFormSubmit = await elements.submit()
    if (stripeFormSubmit.error) {
      setErrorMessage(stripeFormSubmit.error.message as string)
      setIsLoading(false)
      return
    }

    const paymentIntent = await createPaymentIntentAction(email, productId, couponData?.id)
    if (paymentIntent.error) {
      setErrorMessage(paymentIntent.error)
      setIsLoading(false)
      return
    }

    // apply stripe payment
    stripe.confirmPayment({
      elements,
      clientSecret: paymentIntent.clientSecret as string,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
      }
    }).then(({error}) => {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        console.log(error)
        error.message && setErrorMessage(error.message)
      } else {
        setErrorMessage('something went wrong, please try again later')
      }
    }).finally(() => setIsLoading(false))
  }

  // apply coupon handler
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const couponInputRef = useRef<HTMLInputElement>(null)
  function applyCouponHandler() {
    if (!couponInputRef.current?.value) return
    const couponSearchParams = new URLSearchParams(searchParams)
    couponSearchParams.set('coupon', couponInputRef.current?.value.toString())
    router.push(`${pathname}?${couponSearchParams}`)
  }

  return (
    <form onSubmit={purchaseProductHandler}>
      <Card>
        <CardHeader>
          <CardTitle>CheckOut</CardTitle>
          {
            errorMessage && (
              <CardDescription>
                <AlertCard variant="destructive" title="Error" message={errorMessage} className="mt-2" />
              </CardDescription>
            ) 
          }
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <LinkAuthenticationElement className="mt-2" onChange={(e) => setEmail(e.value.email)} />
          <div className="mt-2">
            <Label htmlFor="coupon" className="font-normal">Coupon</Label>
            <div className="flex items-center gap-2">
              <Input type="text" placeholder="Discount Coupon" id="coupon" name="coupon" className="w-max" ref={couponInputRef} defaultValue={searchParams.get('coupon')?.toString()} />
              <Button type="button" onClick={applyCouponHandler}>Apply</Button>
            </div>
            {
              couponData && (
                <AlertCard title="Congratulations!" message={`you have now ${couponData?.discountType === "PERCENTAGE" ? percentNumberFormat(couponData.discountAmount) : currencyFormat(couponData?.discountAmount)} discount.`} className="mt-3" />
              )
            }
            {
              (searchParams.get('coupon') !== null && couponData === null) && (
                <AlertCard variant='destructive' title="Error!" message='Invalid or Expired code' className="mt-3" />
              )
            }
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" size='lg' disabled={!stripe || !elements || isLoading || !email} >
          {isLoading ? <LoaderPinwheel className="animate-spin" /> : `Purchase - ${currencyFormat(price)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}