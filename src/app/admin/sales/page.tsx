import { SearchParamsPagination } from "@/lib/typescript/types";
import PageHeader from "../_components/PageHeader";
import SalesTable from "./_components/SlaesTable";

export default function AdminSalesPage({searchParams}: SearchParamsPagination) {
  return (
    <>
      <div className="mb-5">
        <PageHeader>Sales</PageHeader>
      </div>
      <SalesTable searchParams={searchParams} />
    </>
  )
}