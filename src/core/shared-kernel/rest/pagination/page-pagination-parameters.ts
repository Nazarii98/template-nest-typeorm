interface PagePaginationParametersBuilder {
  pageSize: number | null;
  page: number | null;
}

export class PagePaginationParameters {
  take: number | null;
  page: number | null;
  skip: number | null;

  public static fromObject(obj: PagePaginationParametersBuilder): PagePaginationParameters {
    const model = new PagePaginationParameters();
    if (!Number.isInteger(obj.page) || !Number.isInteger(obj.pageSize)) {
      return model;
    }
    model.page = obj.page;
    if (obj.pageSize) {
      model.take = obj.pageSize;
    }
    if (obj.pageSize && obj.page && obj.page > 0) {
      model.skip = (obj.page - 1) * obj.pageSize;
    } else {
      model.skip = 0;
    }
    return model;
  }

  public toQueryParams(): { skip: number; take: number } {
    return {
      skip: this.skip,
      take: this.take,
    };
  }

  public toResponse(): { page: number; pageSize: number } {
    return {
      page: this.page,
      pageSize: this.take,
    };
  }
}
