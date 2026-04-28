export {};

declare global {
  interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data?: T;
  }

  interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: PaginationInfo;
  }
}
