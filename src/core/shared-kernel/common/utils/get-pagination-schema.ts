import { getSchemaPath } from '@nestjs/swagger';
import { Paginated } from '@shared-kernel/rest/pagination/paginated.output';

export const GetPaginationSchema = (Items) => {
  return {
    schema: {
      allOf: [
        { $ref: getSchemaPath(Paginated) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(Items) },
            },
          },
        },
      ],
    },
  };
};
