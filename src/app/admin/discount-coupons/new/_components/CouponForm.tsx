'use client'

import { useFormState } from "react-dom"
import addCouponAction from "../_actions/addCouponAction"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Input } from "@/components/ui/input"
import { AlertCard } from "@/components/AlertCard"
import { Label } from "@/components/ui/label"
import FormButton from "@/components/FormButton"
import { useState } from "react"
import { currencyFormat} from "@/lib/formaters"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { DiscountType } from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"

export default function CouponForm({products}: {products: {id: string, name: string}[]}) {
  const [state, action] = useFormState(addCouponAction, null)
  const router = useRouter()
  const [discountAmount, setDiscountAmount] = useState('')
  const [discountType, setDiscountType] = useState<string>(DiscountType.PERCENTAGE)
  const [isAllProductsSelected, setIsAllProductsSelected] = useState(false)

  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())

  if (state?.ok) {
    toast.success('Coupon Added Successfully', {
      duration: 3000,
      position: "bottom-center"
    })

    router.replace('/admin/discount-coupons')
    router.refresh()
  }

  return (
    <form action={action} className="mt-5 grid w-full max-w-xl items-center gap-3">
      <Input type="text" id="code" name="code" placeholder="Code" required />
      {(state?.error && 'code' in state?.error && state?.error?.code) && <AlertCard variant="destructive" title="Error" message={state?.error?.code[0]} />}

      <div className="flex max-sm:flex-col max-sm:space-y-2">
        <div className="space-y-2 w-1/4 max-sm:w-full">
          <Label>Discount Type</Label>
          <RadioGroup id="discountType" name="discountType" defaultValue={discountType} onChange={(e) => setDiscountType((e.target as HTMLInputElement).value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={DiscountType.PERCENTAGE} id="percentage" />
              <Label htmlFor="percentage">Percentage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={DiscountType.FIXED} id="fixed" />
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
          {(state?.error && 'discountType' in state?.error && state?.error?.discountType) && <AlertCard variant="destructive" title="Error" message={state?.error?.discountType[0]} className="sm:w-[95%]" />}
        </div>
        <div className="space-y-2 w-3/4 max-sm:w-full">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input type="number" id="discountAmount" name="discountAmount" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} required />
          {
            discountAmount && (
              <span className="text-muted-foreground ms-1 text-sm">
            {discountType === DiscountType.FIXED ? currencyFormat(Number(discountAmount)) : `${discountAmount}%`}
          </span>
            )
          }
          {(state?.error && 'discountAmount' in state?.error && state?.error?.discountAmount) && <AlertCard variant="destructive" title="Error" message={state?.error?.discountAmount[0]} />}
        </div>
      </div>

      <div className="space-y-2">
        <Input type="number" id="limit" name="limit" placeholder="Limit" />
        <span className="text-muted-foreground ms-1 text-sm">
          Leave blank for infinite uses
        </span>
        {(state?.error && 'limit' in state?.error && state?.error?.limit) && <AlertCard variant="destructive" title="Error" message={state?.error?.limit[0]} />}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiration</Label>
        <Input type="datetime-local" id="expiresAt" name="expiresAt" className="w-max" min={now.toJSON().split(':').slice(0, -1).join(':')} />
        <span className="text-muted-foreground ms-1 text-sm">
          Leave blank for no expiration
        </span>
        {(state?.error && 'expiresAt' in state?.error && state?.error?.expiresAt) && <AlertCard variant="destructive" title="Error" message={state?.error?.expiresAt[0]} />}
      </div>

      <div className="space-y-2">
        <Label>Allowed Products</Label>
        <div className="flex items-center space-x-2">
          <Checkbox id="allProducts" name="allProducts" checked={isAllProductsSelected} onCheckedChange={e => setIsAllProductsSelected(!!e)} value='allProducts' />
          <Label htmlFor="allProducts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">All Products</Label>
        </div>
      </div>
      {
          products.map(product => (
            <div key={product.id} className="flex items-center space-x-2">
          <Checkbox id={product.id} name="productIds" value={product.id} disabled={isAllProductsSelected} />
          <Label htmlFor={product.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{product.name}</Label>
        </div>
          ))
        }
        {
          (state?.error && 'allProducts' in state?.error && state?.error?.allProducts) && <AlertCard variant="destructive" title="Error" message={state?.error?.allProducts[0]} />
          ||
          (state?.error && 'productIds' in state?.error && state?.error?.productIds) && <AlertCard variant="destructive" title="Error" message={state?.error?.productIds[0]} />
        }

      <FormButton BtnName='Create Coupon' />
      
      {(state?.error && 'message' in state?.error && state?.error?.message) && <AlertCard variant="destructive" title="Error" message={state?.error?.message} />}
    </form>
  )
}