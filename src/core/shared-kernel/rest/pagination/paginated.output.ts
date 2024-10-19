import { ApiResponseProperty } from '@nestjs/swagger';
import { CursorPaginationParameters } from './cursor-pagination-parameters';
import { PagePaginationParameters } from './page-pagination-parameters';
import { PaginationVariants } from './pagination.type';

class PaginatedResponseMetadata {
  @ApiResponseProperty({})
  pageSize: number;
  @ApiResponseProperty({})
  page?: number | null;
  @ApiResponseProperty({})
  cursor?: number | null;
  @ApiResponseProperty({})
  total: number;
}

export class Paginated<T> {
  data: T[];

  @ApiResponseProperty({
    type: PaginatedResponseMetadata,
  })
  pagination: {
    pageSize: number;
    page?: number | null;
    cursor?: number | null;
    total: number;
  } | null;

  public static fromObject<T>(data: T[], pagination: PaginationVariants, total: number);
  public static fromObject<T extends { id: number }>(data: T[], pagination: PaginationVariants, total: number) {
    const model = new Paginated<T>();
    model.data = data;

    if (!pagination) {
      model.pagination = null;
    } else {
      if (pagination instanceof CursorPaginationParameters) {
        model.pagination = {
          pageSize: pagination.take,
          cursor: data ? data[data.length - 1]?.id : null,
          total: total,
        };
      } else if (pagination instanceof PagePaginationParameters) {
        model.pagination = {
          pageSize: pagination.take,
          page: pagination.skip / pagination.take + 1,
          total: total,
        };
      }
    }

    return model;
  }
}
