export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}
