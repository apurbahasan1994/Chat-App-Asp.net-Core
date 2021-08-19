export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number

}
export class PaginatedResult<T>{
  results: T;
  pagination: Pagination;
}
