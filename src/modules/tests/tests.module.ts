import { Module } from '@nestjs/common';
import { TestsController } from './tests.controller';
import { PushNotificationService, UsersService } from 'src/services';

@Module({
  controllers: [TestsController],
  providers: [UsersService, PushNotificationService],
})
export class TestsModule {}
