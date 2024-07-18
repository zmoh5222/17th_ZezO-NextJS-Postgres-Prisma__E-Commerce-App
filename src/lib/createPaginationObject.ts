import { PaginationObject } from "./typescript/types"
import { PrismaClient } from "@prisma/client/extension"


export async function createPaginationObject({page, skip, limit, prismaModel}: {page: number, skip: number, limit: number, prismaModel: PrismaClient}) {
  let paginationObject = {} as PaginationObject

  // get all results
  const allResults = await prismaModel.count()

  // build pagination object
  paginationObject.limit = limit * 1 
  if (skip > 0) { 
    paginationObject.previousPage = page - 1 
  }
  paginationObject.currentPage = page
  if ( page * limit < allResults) { 
    paginationObject.nextPage = page + 1
  }
  paginationObject.totalPages = Math.ceil(allResults / limit) || 1
  paginationObject.totalResults = allResults

  return paginationObject
}