import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ErrorKey } from '@shared-kernel/common/enums/error-key.enum';
import { CursorPaginationParameters } from './cursor-pagination-parameters';
import { PagePaginationParameters } from './page-pagination-parameters';
import { PaginationType, PaginationVariants } from './pagination.type';
import { Configuration } from '../../../configuration/config';

type DecoratorParams = {
  type?: PaginationType;
  isOptional?: boolean;
};

const DEFAULT_PAGE_SIZE = Configuration.pagination.defaultPageSize;
const DEFAULT_PAGE_NUMBER = Configuration.pagination.defaultPageNumber;

export const Pagination = createParamDecorator<DecoratorParams>((data: DecoratorParams, context: ExecutionContext): PaginationVariants => {
  const request = context.switchToHttp().getRequest();
  const { cursor, page, pageSize } = request.query;

  if (data?.isOptional && !cursor && !page && !pageSize) {
    return null;
  }

  if (!data?.type && cursor && page) {
    throw new BadRequestException({
      message: 'Incorrect pagination parameters. Use only one type cursor or page',
      key: ErrorKey.incorrect_pagination_parameters,
    });
  }

  if (cursor || data.type === 'cursor') {
    return CursorPaginationParameters.fromObject({
      pageSize: pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE,
      cursor: cursor || null,
    });
  }

  if (page || data.type === 'page') {
    return PagePaginationParameters.fromObject({
      pageSize: pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE,
      page: page ? parseInt(page) : DEFAULT_PAGE_NUMBER,
    });
  }

  return PagePaginationParameters.fromObject({
    pageSize: pageSize ? parseInt(pageSize) : DEFAULT_PAGE_SIZE,
    page: DEFAULT_PAGE_NUMBER,
  });
});
