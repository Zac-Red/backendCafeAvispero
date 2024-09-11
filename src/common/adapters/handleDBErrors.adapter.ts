import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";

@Injectable()
export class HandleDBErrors {
  //! Metodo para manejar excepciones de la base de datos
  exceptionsDB(error:any):never{
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    if (error.code === '23503')
      throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('pleas check server logs');
  }
}