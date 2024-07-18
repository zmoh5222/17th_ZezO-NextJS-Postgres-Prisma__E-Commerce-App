"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { PaginationLink } from "./ui/pagination";
import { PropsWithChildren } from "react";

export default function PaginateLink({
  children,
  page,
}: { page: number } & PropsWithChildren) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paginateSearchParams = new URLSearchParams(searchParams);
  if (page) paginateSearchParams.set("page", page.toString());
  return (
    <PaginationLink href={`${pathname}?${paginateSearchParams.toString()}`}>
      {children}
    </PaginationLink>
  );
}
