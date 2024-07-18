import { SearchParamsPagination } from "@/lib/typescript/types";
import PageHeader from "../_components/PageHeader";
import CustomersTable from "./_components/CustomersTable";

export default function AdminCustomersPage({searchParams}: SearchParamsPagination) {
  return (
    <>
      <div className="mb-5">
        <PageHeader>Customers</PageHeader>
      </div>
      <CustomersTable searchParams={searchParams} />
    </>
  )
}