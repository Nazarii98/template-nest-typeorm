import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthorizedUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): any => {
  const request = ctx.switchToHttp().getRequest();
  return request.currentUser;
});
