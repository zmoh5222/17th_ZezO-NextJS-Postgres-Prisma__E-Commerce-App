import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyFormat, dateFormat, dateTimeFormat, numberFormat, percentNumberFormat, remainingTimeWithIntl } from "@/lib/formaters";
import { CheckCircle2, CircleX, Globe, GlobeLock, Infinity, Minus, MoreVertical, ShieldX } from "lucide-react";
import ActivateDeactivateCouponToggleDropdownMenuItem from "./ActivateDeactivateCouponToggleDropdownMenuItem";
import DeleteCouponDropdownMenuItem from "./DeleteCouponDropdownMenuItem";
import { AlertCard } from "@/components/AlertCard";
import { DiscountType } from "@prisma/client";
import TableHeadLink from "../../_components/TableHeadLink";
import remainingTimeWithDateFns from "@/lib/remainingTimeWithDateFns";

type CouponsProps = {
  coupons: {
    id: string,
    code: string,
    isActive: boolean,
    isAvailableForAllProducts: boolean,
    discountType: DiscountType,
    discountAmount: number,
    limit?: number | null,
    uses: number,
    expiresAt?: Date | null,
    createdAt: Date,
    remainingUses?: number,
    products: {
      id: string
      name: string
    }[],
    _count: {
      orders: number
    }
  }[]
  canBeDeactivated?: boolean,
  orderByParams: string
}

export default async function CouponsTable({coupons, canBeDeactivated=true, orderByParams}: CouponsProps) {

  const couponType = canBeDeactivated ? 'valid' : 'expired'

  const orderBy = orderByParams

  if (coupons?.length === 0) {
    return <AlertCard title="No coupons until now!" className="max-w-md shadow mt-5" />
  }

  return (
    <>
    <Table>
      <TableCaption>A list of your recent coupons.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Valid Coupons</span>
          </TableHead>
          <TableHeadLink tableScope="discountCoupon" orderBy="code" couponType={couponType}>Code</TableHeadLink>
          <TableHead>Discount</TableHead>
          <TableHeadLink tableScope="discountCoupon" orderBy="expiresAt" couponType={couponType}>ExpiresAt</TableHeadLink>
          <TableHeadLink tableScope="discountCoupon" orderBy="expiresAt" couponType={couponType}>ExpiresIn</TableHeadLink>
          <TableHeadLink tableScope="discountCoupon" orderBy="limit" couponType={couponType}>Limit</TableHeadLink>
          <TableHeadLink tableScope="discountCoupon" orderBy="uses" couponType={couponType}>Uses</TableHeadLink>
          <TableHeadLink tableScope="discountCoupon" orderBy="remainingUses" couponType={couponType}>Remaining</TableHeadLink>
          <TableHeadLink tableScope="discountCoupon" orderBy="orders" couponType={couponType}>Orders</TableHeadLink>
          <TableHead>Products</TableHead>
          <TableHeadLink tableScope="discountCoupon" orderBy="createdAt" couponType={couponType}>CreatedAt</TableHeadLink>
          <TableHead className="w-0">
            <span className="sr-only">Coupons Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          coupons.map(coupon => {
            return (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">
                {
                  canBeDeactivated ? (
                    coupon.isActive ? (
                      <>
                        <span className="sr-only">valid coupon</span>
                        <CheckCircle2 />
                      </>
                    ) : (
                      <>
                        <span className="sr-only">expired coupon</span>
                        <CircleX className="stroke-destructive" />
                      </>
                    )
                  ) : (
                    <>
                      <span className="sr-only">expired coupon</span>
                      <CircleX className="stroke-destructive" />
                    </>
                  )
                }
                </TableCell>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountType === "FIXED" ? currencyFormat(coupon.discountAmount) : percentNumberFormat(coupon.discountAmount)}</TableCell>
                <TableCell>{coupon.expiresAt ? dateTimeFormat(coupon.expiresAt) : <Minus />}</TableCell>
                <TableCell>{coupon.expiresAt ? remainingTimeWithIntl(coupon.expiresAt) : <Infinity />}</TableCell>
                <TableCell>{coupon.limit ? coupon.limit : <Infinity />}</TableCell>
                <TableCell>{numberFormat(coupon.uses)}</TableCell>
                <TableCell>{coupon.limit ? (orderBy === 'remainingUses' ? numberFormat(coupon.remainingUses || 0) : numberFormat(coupon.limit - coupon.uses)) : <Infinity />}</TableCell>
                <TableCell>{numberFormat(coupon._count.orders)}</TableCell>
                <TableCell>{coupon.isAvailableForAllProducts ? <Globe /> : (
                  <ul>
                    {
                      coupon.products.map(({ id, name }) => (
                        <li key={id}>{name}</li>
                      ))
                    }
                  </ul>
                )}</TableCell>
                <TableCell>{dateFormat(coupon.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <>
                        <span className="sr-only">coupons actions</span>
                        <MoreVertical />
                      </>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {
                        canBeDeactivated && (
                          <>
                          <ActivateDeactivateCouponToggleDropdownMenuItem id={coupon.id} isActive={coupon.isActive} />
                          <DropdownMenuSeparator />
                          </>
                        )
                      }
                      <DeleteCouponDropdownMenuItem id={coupon.id} isDeleteDisabled={coupon._count.orders > 0} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
    </>
  );
}