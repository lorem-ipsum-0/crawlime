export interface PaginatedResponse<T> {
  list: T[];
  hasMore: boolean;
}
