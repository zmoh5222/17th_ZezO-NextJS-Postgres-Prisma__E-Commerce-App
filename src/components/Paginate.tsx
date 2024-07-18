import { ChevronsLeft, ChevronsRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "./ui/pagination";
import { PaginationObject } from "@/lib/typescript/types";
import PaginateLink from "./PaginateLink";

export default function Paginate({
  paginationObject,
  href,
  ...props
}: {
  paginationObject: PaginationObject;
  href: string;
}) {
  return (
    <Pagination className="mt-5">
      <PaginationContent>
        <PaginationItem
          className={`${paginationObject.currentPage <= 2 && "hidden"}`}
          title="First Page"
        >
          <PaginateLink page={1}>
            <ChevronsLeft className="size-5" />
          </PaginateLink>
        </PaginationItem>

        <PaginationItem
          className={`${paginationObject.currentPage <= 2 && "hidden"}`}
        >
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem
          className={`${!paginationObject.previousPage && "hidden"}`}
        >
          <PaginateLink page={paginationObject?.previousPage}>
            {paginationObject?.previousPage}
          </PaginateLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            {paginationObject.currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className={`${!paginationObject.nextPage && "hidden"}`}>
          <PaginateLink page={paginationObject?.nextPage}>
            {paginationObject?.nextPage}
          </PaginateLink>
        </PaginationItem>

        <PaginationItem
          className={`${
            paginationObject.totalPages < paginationObject.currentPage + 2 &&
            "hidden"
          }`}
        >
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem
          className={`${
            paginationObject.totalPages < paginationObject.currentPage + 2 &&
            "hidden"
          }`}
          title="Last Page"
        >
          <PaginateLink page={paginationObject.totalPages}>
            <ChevronsRight className="size-5" />
          </PaginateLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
