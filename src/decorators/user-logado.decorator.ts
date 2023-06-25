import { ExecutionContext, createParamDecorator } from '@nestjs/common';
export const UserLogado = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().user;
});
