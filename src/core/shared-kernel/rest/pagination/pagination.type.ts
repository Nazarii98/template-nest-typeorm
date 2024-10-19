import { CursorPaginationParameters } from './cursor-pagination-parameters';
import { PagePaginationParameters } from './page-pagination-parameters';

export type PaginationType = 'cursor' | 'page';

export type PaginationVariants = CursorPaginationParameters | PagePaginationParameters;
