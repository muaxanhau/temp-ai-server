import { Module } from '@nestjs/common';
import { ReferencesService, UsersService } from 'src/services';
import { ReferenceController } from './reference.controller';

@Module({
  controllers: [ReferenceController],
  providers: [ReferencesService, UsersService],
})
export class ReferenceModule {}
