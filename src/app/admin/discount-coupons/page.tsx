import PageHeader from "../_components/PageHeader";
import CouponsTable from "./_components/CouponsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/db/prismaClient";
import { discountCoupon, DiscountType, Prisma } from "@prisma/client";
import { SearchParamsPagination } from "@/lib/typescript/types";

type CouponsType = {
  limit: number | null;
  expiresAt: Date | null;
  id: string;
  code: string;
  discountAmount: number;
  discountType: DiscountType;
  uses: number;
  isActive: boolean;
  isAvailableForAllProducts: boolean;
  createdAt: Date;
  products: {
    id: string,
    name: string
  }[];
  _count: {
    orders: number
  };
  remainingUses?: number
}[]

export default async function DiscoutCouponsPage({searchParams}: SearchParamsPagination) {
  const WHERE_EXPIRED_COUPONS: Prisma.discountCouponWhereInput = {
    OR: [
      {
        expiresAt: {
          not: null,
          lte: new Date()
        }
      },
      {
        limit: {
          not: null,
          lte: prisma.discountCoupon.fields.uses
        }
      }
    ]
  }

  const COUPONS_SELECT: Prisma.discountCouponSelect = {
    id: true,
    code: true,
    isActive: true,
    isAvailableForAllProducts: true,
    discountType: true,
    discountAmount: true,
    limit: true,
    uses: true,
    expiresAt: true,
    createdAt: true,
    products: {
      select: {
        id: true,
        name: true
      }
    },
    _count: {
      select: {
        orders: true
      }
    }
  }

  // sorting
  // get sort values
  const orderBy = searchParams.orderBy as keyof discountCoupon | 'orders' | 'remainingUses'
  const operator = searchParams.operator as 'asc' | 'desc'
  const couponType = searchParams.couponType as 'valid' | 'expired'

  let VALID_COUPONS_ORDER_BY:Prisma.discountCouponOrderByWithRelationInput = {
    createdAt: "desc"
  }
  
  let EXPIRED_COUPONS_ORDER_BY:Prisma.discountCouponOrderByWithRelationInput = {
    createdAt: "desc"
  }
  
  if (couponType === "valid" && orderBy !== 'orders' && orderBy !== 'remainingUses') {
    VALID_COUPONS_ORDER_BY = {
      [orderBy]: operator
    }
  }
  
  if (couponType === "expired" && orderBy !== 'orders' && orderBy !== 'remainingUses') {
    EXPIRED_COUPONS_ORDER_BY = {
      [orderBy]: operator
    }
  }

  // get coupons
  let [validCoupons, expiredCoupons]: CouponsType[] = await Promise.all([
    prisma.discountCoupon.findMany({
      where: {
        NOT: WHERE_EXPIRED_COUPONS
      }, 
      select: COUPONS_SELECT,
      orderBy: VALID_COUPONS_ORDER_BY
    }),
    prisma.discountCoupon.findMany({
      where: WHERE_EXPIRED_COUPONS, 
      select: COUPONS_SELECT,
      orderBy: EXPIRED_COUPONS_ORDER_BY
    })
  ])

  // sort remaining field inside valid table
  if (couponType === "valid" && orderBy === 'remainingUses') {
    validCoupons.forEach(coupon => {
      if (coupon.limit !== null && coupon.limit !== 0) {
        coupon.remainingUses = coupon.limit - coupon.uses;
      } 
      else if (coupon.limit === null) {
        coupon.remainingUses = undefined;
      } else {
        coupon.remainingUses = 0;
      }
    });
  
    validCoupons = validCoupons.sort((a, b) => {
      if (a.remainingUses === undefined) return operator === "desc" ? -1 : 1;
      if (b.remainingUses === undefined) return operator === "desc" ? 1 : -1;
      if (a.remainingUses === 0 && b.remainingUses !== 0) return operator === "desc" ? 1 : -1;
      if (b.remainingUses === 0 && a.remainingUses !== 0) return operator === "desc" ? -1 : 1;
      const comparison = (b.remainingUses) - (a.remainingUses);
      return operator === "desc" ? comparison : -comparison;
    });
  }

  // sort remaining field inside expired table
  if (couponType === "expired" && orderBy === 'remainingUses') {
    expiredCoupons.forEach(coupon => {
      if (coupon.limit !== null && coupon.limit !== 0) {
        coupon.remainingUses = coupon.limit - coupon.uses;
      } 
      else if (coupon.limit === null) {
        coupon.remainingUses = undefined;
      } else {
        coupon.remainingUses = 0;
      }
    });
  
    expiredCoupons = expiredCoupons.sort((a, b) => {
      if (a.remainingUses === undefined) return operator === "desc" ? -1 : 1;
      if (b.remainingUses === undefined) return operator === "desc" ? 1 : -1;
      if (a.remainingUses === 0 && b.remainingUses !== 0) return operator === "desc" ? 1 : -1;
      if (b.remainingUses === 0 && a.remainingUses !== 0) return operator === "desc" ? -1 : 1;
      
      const comparison = (b.remainingUses) - (a.remainingUses);
      return operator === "desc" ? comparison : -comparison;
    });
  }

  // sort orders field inside valid table
  if (couponType === "valid" && orderBy === 'orders') {
    validCoupons = validCoupons.sort((a, b) => {
      const comparison = b._count.orders - a._count.orders
      return operator === "desc" ? comparison : -comparison
    })
  }

  // sort orders field inside expired table
  if (couponType === "expired" && orderBy === 'orders') {
    expiredCoupons = expiredCoupons.sort((a, b) => {
      const comparison = b._count.orders - a._count.orders
      return operator === "desc" ? comparison : -comparison
    })
  }
  
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <PageHeader>Coupons</PageHeader>
        <Button asChild>
          <Link href="/admin/discount-coupons/new">Add Coupon</Link>
        </Button>
      </div>
      <CouponsTable coupons={validCoupons} orderByParams={searchParams.orderBy || ''} />
      <div className="my-5">
        <h1 className="text-xl font-bold">Expired Coupons</h1>
        <CouponsTable coupons={expiredCoupons} canBeDeactivated={false} orderByParams={searchParams.orderBy || ''} />
      </div>
    </>
  )
}