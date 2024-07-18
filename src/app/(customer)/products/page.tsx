import { Suspense } from "react";
import ProductCardSkeleton from "../_components/ProductCardSkeleton";
import prisma from "@/db/prismaClient";
import { ProductsSuspense } from "../_components/ProductGridSection";
import Paginate from "@/components/Paginate";
import { PaginationObject, SearchParamsPagination } from "@/lib/typescript/types";
import { createPaginationObject } from "@/lib/createPaginationObject";

export default async function ProductsPage({searchParams}: SearchParamsPagination) {
  // set default values for pagination
  const page = Number(searchParams?.page) || 1
  const limit = Number(searchParams.limit) || Number(process.env.CUSTOMER_PRODUCTS_PAGE_LIMIT)
  const skip = (page - 1) * limit

  const paginationObject = await createPaginationObject({
    page,
    limit,
    skip,
    prismaModel: prisma.product
  })

  async function getAllProducts() {
    const products = await prisma.product.findMany({
      where: {
        isAvailableForPurchase: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })
  
    return products
  }

  return (
    <section>
      <h1 className="text-2xl font-bold">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        <Suspense fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        } >
          <ProductsSuspense productsFetcher={getAllProducts} />
        </Suspense>
      </div>
      <div>
        {
          paginationObject?.totalResults !== 0 && (
            <Paginate paginationObject={paginationObject} href="/products" />
          )
        }
      </div>
    </section>
  )
}

