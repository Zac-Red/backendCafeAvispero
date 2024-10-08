import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data:string, ctx: ExecutionContext) => {
    /* 
      * El parametro "data" contiene los parametros 
      * que recibe el decorador al ser ejecutado
    */    
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    
    if (!user) {
      throw new InternalServerErrorException('User not found (request)');
    }

    return (!data) 
      ? user 
      : user[data];
  }
); 