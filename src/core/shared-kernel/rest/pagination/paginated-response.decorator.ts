import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from '@nestjs/swagger';

import { Configuration } from '../../../configuration/config';

import { Paginated } from './paginated.output';
import { PaginationType } from './pagination.type';

export const PaginatedResponse = (type: Type, paginationType?: PaginationType) => {
  const apiQueryParams = [];

  if (paginationType) {
    apiQueryParams.push(
      ApiQuery({
        name: 'pageSize',
        schema: { default: Configuration.pagination.defaultPageSize, type: 'number', minimum: 1 },
        required: false,
      }),
    );
    if (paginationType === 'cursor') {
      apiQueryParams.push(
        ApiQuery({
          name: 'cursor',
          schema: { default: null, type: 'number' },
          required: false,
        }),
      );
    }

    if (paginationType === 'page') {
      apiQueryParams.push(
        ApiQuery({
          name: 'page',
          schema: { default: null, type: 'number', minimum: 0 },
          required: false,
        }),
      );
    }
  }

  return applyDecorators(
    ApiExtraModels(type, Paginated),
    ...apiQueryParams,
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(Paginated) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  );
};
