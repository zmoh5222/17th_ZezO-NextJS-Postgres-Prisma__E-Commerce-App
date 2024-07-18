'use client'

import { TableHead } from "@/components/ui/table";
import { discountCoupon, Order, Product, User } from "@prisma/client";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

type TableHeadLinkProps<T extends 'User' | 'Product' | 'Order' | 'discountCoupon'> = {
  tableScope: T;
  orderBy: T extends 'User' ? keyof User | 'orders' | 'sales' : T extends 'Product' ? keyof Product | 'orders' | 'sales' : T extends 'Order' ? keyof Order : T extends 'discountCoupon' ? keyof discountCoupon | 'orders' | 'remainingUses' : never; // Default to never if no match
} & (T extends 'discountCoupon' ? { couponType: 'valid' | 'expired' } : { couponType?: never }) & PropsWithChildren;

export default function TableHeadLink<T extends 'User' | 'Product' | 'Order' | 'discountCoupon'>({children, orderBy, couponType}: TableHeadLinkProps<T>) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const tableSearchParams = new URLSearchParams(searchParams)
  const operator = tableSearchParams.get('operator')
  const orderByParams = tableSearchParams.get('orderBy')
  const couponTypeParams = tableSearchParams.get('couponType')

  const clickHandler = () => {
    const conditionalOperator = !operator || (orderByParams === orderBy && operator === 'desc') ? 'asc' : (orderByParams === orderBy && operator === 'asc') ? 'desc' : 'asc'

    tableSearchParams.set('orderBy', orderBy)
    tableSearchParams.set('operator', conditionalOperator)

    if (couponType) tableSearchParams.set('couponType', couponType)

    router.push(`${pathname}?${tableSearchParams.toString()}`, {
      scroll: false
    })
  }
  return (
    <TableHead>
      <button onClick={clickHandler} className="flex items-center">
        {children}
        {
          orderByParams === orderBy && operator === 'desc' && (couponTypeParams ? couponType === couponTypeParams : true) &&<ArrowDownWideNarrow className="ms-2" />
        }
        {
          orderByParams === orderBy && operator === 'asc' && (couponTypeParams ? couponType === couponTypeParams : true) && <ArrowUpNarrowWide className="ms-2" />
        }
      </button>
    </TableHead>
  )
}