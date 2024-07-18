import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/db/prismaClient";
import { currencyFormat, dateFormat, numberFormat } from "@/lib/formaters";
import { MoreVertical } from "lucide-react";
import DeleteCustomerDropdownMenuItem from "./DeleteCustomerDropdownMenuItem";
import { PaginationObject, SearchParamsPagination } from "@/lib/typescript/types";
import Paginate from "@/components/Paginate";
import { createPaginationObject } from "@/lib/createPaginationObject";
import { AlertCard } from "@/components/AlertCard";
import TableHeadLink from "../../_components/TableHeadLink";
import { Prisma, User } from "@prisma/client";

type UsersType = {
  id: string;
  email: string;
  createdAt: Date;
  orders: {
      paidPrice: number;
  }[];
  _count: {
      orders: number;
  };
  ordersCount: number;
  ordersSum: number;
}[]

export default async function CustomersTable({searchParams}: SearchParamsPagination) {
  // set default values for pagination
  const page = Number(searchParams?.page) || 1
  const limit = Number(searchParams.limit) || Number(process.env.ADMIN_PAGES_LIMIT)
  const skip = (page - 1) * limit

  // create pagination object
  const paginationObject = await createPaginationObject({
    page,
    limit,
    skip,
    prismaModel: prisma.user
  })

  let USER_ORDER_BY: Prisma.UserOrderByWithRelationInput = {
    createdAt: 'desc'
  }

  // get sort values
  const orderBy = searchParams.orderBy as keyof User | 'orders' | 'sales'
  const operator = searchParams.operator as 'asc' | 'desc'

  if (orderBy && operator && orderBy !== "orders" && orderBy !== "sales") {
    USER_ORDER_BY = {
      [orderBy]: operator
    }
  }

  // get users
  let users
  if (orderBy !== "orders" && orderBy !== "sales") {
    users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        orders: {
          select: {
            paidPrice: true,
          }
        },
        _count: true
      },
      orderBy: USER_ORDER_BY,
      skip,
      take: limit
    })
  }

  // sort specific field --> orders
  if (orderBy === "orders" && operator === "desc") {
    users = await prisma.$queryRaw`
      SELECT 
        u.id, 
        u.email,
        u."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "User" u
        LEFT JOIN "Order" o ON u.id = o."userId"
      GROUP BY 
        u.id
      ORDER BY 
      "ordersCount" DESC
      LIMIT ${limit} OFFSET ${skip};
    `;
  }
  if (orderBy === "orders" && operator === "asc") {
    users = await prisma.$queryRaw`
    SELECT 
      u.id, 
      u.email,
      u."createdAt", 
      COUNT(o.id) as "ordersCount",
      COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
    FROM 
      "User" u
      LEFT JOIN "Order" o ON u.id = o."userId"
    GROUP BY 
      u.id
    ORDER BY 
    "ordersCount" ASC
    LIMIT ${limit} OFFSET ${skip};
  `;
  }

  // sort specific field --> sales
  if (orderBy === "sales") {
    if (operator === "desc") {
      users = await prisma.$queryRaw`
      SELECT 
        u.id, 
        u.email,
        u."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "User" u
        LEFT JOIN "Order" o ON u.id = o."userId"
      GROUP BY 
        u.id
      ORDER BY 
      "ordersSum" DESC
      LIMIT ${limit} OFFSET ${skip};
    `;
    }

    if (operator === "asc") {
      users = await prisma.$queryRaw`
      SELECT 
        u.id, 
        u.email,
        u."createdAt", 
        COUNT(o.id) as "ordersCount",
        COALESCE(SUM(o."paidPrice"), 0) as "ordersSum"
      FROM 
        "User" u
        LEFT JOIN "Order" o ON u.id = o."userId"
      GROUP BY 
        u.id
      ORDER BY 
      "ordersSum" ASC
      LIMIT ${limit} OFFSET ${skip};
    `;
    }
  }

  if ((users as UsersType)?.length === 0) {
    return <AlertCard title="No customers until now!" className="max-w-md shadow" />
  }

  return (
    <>
    <Table>
      <TableCaption>A list of your recent customers.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHeadLink tableScope="User" orderBy="email">Email</TableHeadLink>
          <TableHeadLink tableScope="User" orderBy="orders">Orders</TableHeadLink>
          <TableHeadLink tableScope="User" orderBy="sales">Sales</TableHeadLink>
          <TableHeadLink tableScope="User" orderBy="createdAt">CreatedAt</TableHeadLink>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          (users as UsersType).map(user => {
            return (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{orderBy === "orders" || orderBy === "sales" ? numberFormat(Number(user.ordersCount)) : numberFormat(user._count.orders)}</TableCell>
                <TableCell>{orderBy === "orders" || orderBy === "sales" ? currencyFormat(Number(user.ordersSum) / 100) : currencyFormat(user.orders.reduce((sum, order) => sum + order.paidPrice, 0) / 100)}</TableCell>
                <TableCell>{dateFormat(user.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <>
                        <span className="sr-only">customer actions</span>
                        <MoreVertical />
                      </>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DeleteCustomerDropdownMenuItem id={user.id} />
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
        <Paginate paginationObject={paginationObject} href="/admin/customers" />
      )
    }
    </>
  );
}