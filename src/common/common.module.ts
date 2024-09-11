import { Module } from '@nestjs/common';
import { HandleDBErrors, UuidAdapter } from './adapters';

@Module({
  providers: [UuidAdapter, HandleDBErrors],
  exports: [UuidAdapter, HandleDBErrors]
})
export class CommonModule {}
