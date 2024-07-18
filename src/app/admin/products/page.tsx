import { Button } from "@/components/ui/button";
import PageHeader from "../_components/PageHeader";
import Link from "next/link";
import ProductsTable from "./_components/ProductsTable";
import { SearchParamsPagination } from "@/lib/typescript/types";

export default function AdminProductsPage({searchParams}: SearchParamsPagination) {
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable searchParams={searchParams} />
    </>
  );
}
