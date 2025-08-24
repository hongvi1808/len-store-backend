export class PaginationItemModel<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;

    constructor(items: T[], total: number, page: number, limit: number,) {
        this.items = items;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPage = Math.ceil(total / limit);
    }
}
export class ResSuccessModel<T> {
  success: boolean;
  data: T | PaginationItemModel<T>;
  constructor(data: T | PaginationItemModel<T>) {
    this.success = true;
    this.data = data;
  }
}