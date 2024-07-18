

export type PaginationObject = {
  limit: number,
  previousPage: number,
  currentPage: number,
  nextPage: number,
  totalPages: number,
  totalResults: number
}

export type SearchParamsPagination = {
  searchParams: {
    page?: string
    limit?: string
    orderBy?: string
    operator?: string
    couponType?: string
  }
}