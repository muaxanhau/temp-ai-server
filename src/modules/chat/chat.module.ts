import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import {
  ChatService,
  PushNotificationService,
  UsersService,
} from 'src/services';

@Module({
  controllers: [ChatController],
  providers: [UsersService, ChatService, PushNotificationService],
})
export class ChatModule {}
