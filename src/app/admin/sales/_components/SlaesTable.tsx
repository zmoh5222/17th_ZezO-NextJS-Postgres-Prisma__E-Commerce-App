import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/db/prismaClient";
import { Minus, MoreVertical } from "lucide-react";
import DeleteOrderDropdownMenuItem from "./DeleteOrderDropdownMenuItem";
import { currencyFormat, dateFormat, percentNumberFormat } from "@/lib/formaters";
import { PaginationObject, SearchParamsPagination } from "@/lib/typescript/types";
import Paginate from "@/components/Paginate";
import { createPaginationObject } from "@/lib/createPaginationObject";
import { AlertCard } from "@/components/AlertCard";
import { Order, Prisma } from "@prisma/client";
import TableHeadLink from "../../_components/TableHeadLink";

export default async function SalesTable({searchParams}: SearchParamsPagination) {
  // set default values for pagination
  const page = Number(searchParams?.page) || 1
  const limit = Number(searchParams.limit) || Number(process.env.ADMIN_PAGES_LIMIT)
  const skip = (page - 1) * limit

  // create pagination object
  const paginationObject = await createPaginationObject({
    page,
    limit,
    skip,
    prismaModel: prisma.order
  })

  // get sort values
  const orderBy = searchParams.orderBy as keyof Order
  const operator = searchParams.operator as 'asc' | 'desc'

  let ORDER_ORDER_BY: Prisma.OrderOrderByWithRelationInput = {
    [orderBy]: operator
  }

  if (orderBy === 'name' as keyof Order) {
    ORDER_ORDER_BY = {
      product: {name: operator}
    }
  }

  if (orderBy === 'email' as keyof Order) {
    ORDER_ORDER_BY = {
      user: {email: operator}
    }
  }

  const DEFAULT_ORDER_BY: Prisma.OrderOrderByWithRelationInput = {
    createdAt: 'desc'
  }

  // get orders
  const orders = await prisma.order.findMany({
    select: {
      id: true,
      paidPrice: true,
      createdAt: true,
      product: {
        select: {
          name: true
        }
      },
      user: {
        select: {
          email: true
        }
      },
      discountCoupon: {
        select: {
          code: true,
          discountType: true,
          discountAmount: true
        }
      }
    },
    orderBy: (orderBy && operator )? ORDER_ORDER_BY : DEFAULT_ORDER_BY,
    skip,
    take: limit
  })

  if (orders?.length === 0) {
    return <AlertCard title="No orders until now!" className="max-w-md shadow" />
  }

  return (
    <>
    <Table>
      <TableCaption>A list of your recent sales.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHeadLink tableScope="Product" orderBy="name">Product</TableHeadLink>
          <TableHeadLink tableScope="User" orderBy="email">Customer</TableHeadLink>
          <TableHeadLink tableScope="Order" orderBy="paidPrice">Paid Price</TableHeadLink>
          <TableHead>Coupon</TableHead>
          <TableHead>Discount</TableHead>
          <TableHeadLink tableScope="Order" orderBy="createdAt">CreatedAt</TableHeadLink>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          orders.map(order => {
            return (
              <TableRow key={order.id}>
                <TableCell>{order.product.name}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>{currencyFormat(order.paidPrice / 100)}</TableCell>
                <TableCell>{order.discountCoupon ? order.discountCoupon.code : <Minus />}</TableCell>
                <TableCell>{order.discountCoupon ? (
                  order.discountCoupon.discountType === "PERCENTAGE" ? percentNumberFormat(order.discountCoupon.discountAmount) : currencyFormat(order.discountCoupon.discountAmount)
                ) : <Minus /> }</TableCell>
                <TableCell>{dateFormat(order.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <>
                        <span className="sr-only">customer actions</span>
                        <MoreVertical />
                      </>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DeleteOrderDropdownMenuItem id={order.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })
        }
      </TableBody>
    </Table>
    {
      paginationObject?.totalResults !== 0 && (
        <Paginate paginationObject={paginationObject} href="/admin/sales" />
      )
    }
    </>
  );
}