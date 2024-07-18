import prisma from "@/db/prismaClient";
import PageHeader from "../../_components/PageHeader";
import CouponForm from "./_components/CouponForm";

export default async function NewCouponPage() {
  const products = await prisma.product.findMany()
  return (
    <>
      <PageHeader>Add New Coupon</PageHeader>
      <CouponForm products={products} />
    </>
  )
}