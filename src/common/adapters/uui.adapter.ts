import { Injectable } from '@nestjs/common';
import { validate as validUUID } from 'uuid';

@Injectable()
export class UuidAdapter {
  IsUUID(term:string):boolean {
    return validUUID(term);
  }
}