import Image from "next/image";
import ProductGridSection from "./_components/ProductGridSection";
import prisma from "@/db/prismaClient";

async function getMostSaledProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailableForPurchase: true
    },
    orderBy: {
      orders: {
        _count: 'desc'
      }
    },
    take: 6
  })

  return products
}

async function getNewestProducts() {
  const products = await prisma.product.findMany({
    where: {
      isAvailableForPurchase: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 6
  })

  return products
}

export default function Home() {
  return (
    <main 
      className="space-y-12"
      >
      <ProductGridSection sectionTitle="Most Saled Products" productsFetcher={getMostSaledProducts} />
      <ProductGridSection sectionTitle="Newest Products" productsFetcher={getNewestProducts} />
    </main>
  );
}
