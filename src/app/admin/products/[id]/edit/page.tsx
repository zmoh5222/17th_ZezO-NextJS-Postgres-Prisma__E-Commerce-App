import PageHeader from "@/app/admin/_components/PageHeader";
import ProductForm from "../../new/_components/ProductForm";
import prisma from "@/db/prismaClient";
import { notFound } from "next/navigation";

export default async function EditProductPage({params: {id}}: {params: {id: string}}) {
  const product = await prisma.product.findUnique({
    where: {id}
  })
  
  if (!product) {
    return notFound()
  }
  return (
    <>
      <PageHeader>Update Product</PageHeader>
      <ProductForm product={product}/>
    </>
  )
}