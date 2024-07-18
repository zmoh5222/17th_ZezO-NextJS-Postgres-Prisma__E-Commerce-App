import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/db/prismaClient";
import { CheckCircle2, CircleX, Minus, MoreVertical } from "lucide-react";
import Link from "next/link";
import ActivateDeactivateProductToggleDrpdownMenuItem from "./ActivateDeactivateProductToggleDrpdownMenuItem";
import DeleteProductDropdownMenuItem from "./DeleteProductDropdownMenuItem";
import { currencyFormat, dateFormat, numberFormat } from "@/lib/formaters";
import { PaginationObject, SearchParamsPagination } from "@/lib/typescript/types";
import Paginate from "@/components/Paginate";
import { createPaginationObject } from "@/lib/createPaginationObject";
import { AlertCard } from "@/components/AlertCard";
import TableHeadLink from "../../_components/TableHeadLink";
import { Prisma, Product } from "@prisma/client";

type ProductsType = {
  id: string;
  name: string;
  price: number;
  isAvailableForPurchase: boolean;
  createdAt: Date;
  _count: {
      orders: number;
  };
  orders: {
      paidPrice: number;
  }[];
  ordersCount: number;
  ordersSum: number;
}[]

export default async function ProductsTable({searchParams}: SearchParamsPagination) {
  // set default values for pagination
  const page = Number(searchParams?.page) || 1
  const limit = Number(searchParams.limit) || Number(process.env.ADMIN_PAGES_LIMIT)
  const skip = (page - 1) * limit

  // create pagination object
  const paginationObject = await createPaginationObject({
    page,
    limit,
    skip,
    prismaModel: prisma.product
  })

  let PRODUCT_ORDER_BY: Prisma.ProductOrderByWithRelationInput = {
    createdAt: 'desc'
  }

  // get sort values
  const orderBy = searchParams.orderBy as keyof Product | 'orders' | 'sales'
  const operator = searchParams.operator as 'asc' | 'desc'

  if (orderBy && operator && orderBy !== "orders" && orderBy !== "sales") {
    PRODUCT_ORDER_BY = {
      [orderBy]: operator
    }
  }

  // get products
  let products
  if (orderBy !== "orders" && orderBy !== "sales") {
    products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        isAvailableForPurchase: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        },
        orders: {
          select: {
            paidPrice: true
          }
        }
      },
      orderBy: PRODUCT_ORDER_BY,
      skip,
      take: limit
    })
  }

  // sort custom fields
  // sort specific field --> orders
  if (orderBy === "orders" && operator === "desc") {
    products = await prisma.$queryRaw`
      SELECT 
        p.id, 
        p.name, 
        p.price,
        p."isAvailableForPurchase",
        p."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "Product" p 
        LEFT JOIN "Order" o ON p.id = o."productId"
      GROUP BY 
        p.id 
      ORDER BY 
      "ordersCount" DESC
      LIMIT ${limit} OFFSET ${skip};
    `;
  }
  if (orderBy === "orders" && operator === "asc") {
    products = await prisma.$queryRaw`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p."isAvailableForPurchase", 
        p."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "Product" p 
        LEFT JOIN "Order" o ON p.id = o."productId" 
      GROUP BY 
        p.id 
      ORDER BY 
        "ordersCount" ASC
      LIMIT ${limit} OFFSET ${skip};
    `;
  }


  // sort specific field --> sales
  if (orderBy === "sales") {
    if (operator === "desc") {
      products = await prisma.$queryRaw`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p."isAvailableForPurchase", 
        p."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "Product" p 
        LEFT JOIN "Order" o ON p.id = o."productId" 
      GROUP BY 
        p.id 
      ORDER BY 
        "ordersSum" DESC
      LIMIT ${limit} OFFSET ${skip};
    `;
    }

    if (operator === "asc") {
      products = await prisma.$queryRaw`
      SELECT 
        p.id, 
        p.name, 
        p.price, 
        p."isAvailableForPurchase", 
        p."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "Product" p 
        LEFT JOIN "Order" o ON p.id = o."productId" 
      GROUP BY 
        p.id 
      ORDER BY 
        "ordersSum" ASC
      LIMIT ${limit} OFFSET ${skip};
    `;
    }
  }

  if ((products as ProductsType)?.length === 0) {
    return <AlertCard title="No products found!" message="you can add new products right now." className="max-w-md shadow" />
  }

  // protected content
  const protectedContent = [
    'a912af13-fc68-482f-9a1d-40f100e0c0df',     
    'ff810de1-7c6c-411f-a958-6b32afceea2e',     
    '92e4d659-51c5-42bc-a1b1-71b7ccc19525',     
    '08e7a5b5-78b3-4113-bf90-6b3d91c8e469',     
    '7b6af094-46a0-460d-8565-1697d9af2e87',     
    '6e222fcf-91cb-4bd1-a539-bca7cb68ff01',     
    '9602a949-d77b-4b71-bb9c-11444b2447fd',     
    '626d8581-6d53-4919-8c0b-db914c547c2d',     
    '49196513-ded4-41ab-97d9-637951cd8c99'      
  ]

  return (
    <>
    <Table>
      <TableCaption>A list of your recent products.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Available For Purchase</span>
          </TableHead>
          <TableHeadLink orderBy='name' tableScope='Product' >Name</TableHeadLink>
          <TableHeadLink orderBy='price' tableScope='Product' >Price</TableHeadLink>
          <TableHeadLink orderBy='orders' tableScope='Product' >Orders</TableHeadLink>
          <TableHeadLink orderBy='sales' tableScope='Product' >Sales</TableHeadLink>
          <TableHeadLink orderBy='createdAt' tableScope='Product' >CreatedAt</TableHeadLink>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          (products as ProductsType).map(product => {
            return (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                {
                  product.isAvailableForPurchase ? (
                    <>
                      <span className="sr-only">product available for purchase</span>
                      <CheckCircle2 />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">product unavailable for purchase</span>
                      <CircleX className="stroke-destructive" />
                    </>
                  )
                }
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{currencyFormat(product.price / 100)}</TableCell>
                <TableCell>{ orderBy === "orders" || orderBy === "sales" ? numberFormat(Number(product.ordersCount)) : numberFormat(product._count.orders) }</TableCell>
                <TableCell>{ orderBy === "orders" || orderBy === "sales" ? currencyFormat(Number(product.ordersSum) / 100) : (currencyFormat(product.orders.reduce((sum, order) => sum += order.paidPrice / 100, 0))) }</TableCell>
                <TableCell>{dateFormat(product.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <>
                        <span className="sr-only">product actions</span>
                        <MoreVertical />
                      </>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem className="cursor-pointer" asChild >
                        <a download href={`/admin/products/${product.id}/download`}>Download</a>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" asChild disabled={protectedContent.includes(product.id)}>
                        <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <ActivateDeactivateProductToggleDrpdownMenuItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase} />
                      <DropdownMenuSeparator />
                      <DeleteProductDropdownMenuItem id={product.id} isDeleteDisabled={orderBy === "orders" || orderBy === "sales" ? product.ordersCount > 0 : product._count.orders > 0} />
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
        <Paginate paginationObject={paginationObject} href="/admin/products" />
      )
    }
    </>
  );
}
