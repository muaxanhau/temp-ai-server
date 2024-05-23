import { Module } from '@nestjs/common';
import { ReferencesService } from 'src/services';
import { ReferenceController } from './reference.controller';

@Module({
  controllers: [ReferenceController],
  providers: [ReferencesService],
})
export class ReferenceModule {}
