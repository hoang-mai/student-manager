export { };

declare global {
  interface ApiResponse<T = unknown> {
    statusCode: number;
    message: string;
    data?: T;
  }

  interface PaginationInfo {
    total: number;
    pageIndex: number;
    pageSize: number;
    totalPages: number;
  }

  interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationInfo;
  }
}
