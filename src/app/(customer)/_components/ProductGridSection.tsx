import { Button } from "@/components/ui/button";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Suspense } from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { AlertCard } from "@/components/AlertCard";

type ProductGridSectionProps = {
  sectionTitle: string
  productsFetcher: () => Promise<Product[]>
}

export default function ProductGridSection({sectionTitle, productsFetcher}: ProductGridSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-5">
        <h1 className="text-2xl font-bold">{sectionTitle}</h1>
        <Button variant='outline' asChild >
          <Link href='/products' className="space-x-2" >
            <span>See All</span>
            <ArrowRight className="size-5" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
        <Suspense fallback={
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        } >
          <ProductsSuspense productsFetcher={productsFetcher} />
        </Suspense>
      </div>
    </section>
  )
}

export async function ProductsSuspense({productsFetcher}: {productsFetcher: () => Promise<Product[]>}) {
  const products = await productsFetcher()
  if (products?.length === 0) {
    return <AlertCard title="No products until now!" className="max-w-md shadow" />
  }
  
  return products.map(product => <ProductCard key={product.id} product={product} />)
}