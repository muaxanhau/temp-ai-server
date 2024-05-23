import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import {
  ChatIdModel,
  HeadersBaseModel,
  TriggerKeyPushNotificationEnum,
} from 'src/models';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import {
  ChatService,
  PushNotificationService,
  UsersService,
} from 'src/services';
import {
  ChatBodyModel,
  ChatResponseModel,
  DeleteMessageByIdParamModel,
} from './model';

@Controller('/chat')
export class ChatController {
  private async promptAi(
    userId: string,
    prompt: string,
    history: ChatIdModel[],
    deviceId: string | undefined,
  ) {
    const result = await this.chatService.promptAi(prompt, history);

    await this.chatService.addChat(userId, 'ai', result);
    console.log('done ------------');

    if (!deviceId?.length) return;

    this.pushNotificationService.send({
      deviceId,
      message: 'New chat',
      key: TriggerKeyPushNotificationEnum.CHAT_AI,
    });
  }
  private async transformHistoryChatAi(userId: string) {
    const history = (await this.chatService.getHistoryChat(userId))
      .map((h) => ({ ...h, createdAt: h.createdAt.toDate() }))
      .reverse();
    return history;
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly chatService: ChatService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post()
  @NoRoleGuard()
  async chat(
    @Headers() headers: HeadersBaseModel,
    @Body() body: ChatBodyModel,
  ): Promise<ChatResponseModel> {
    const { id, deviceId } = (await this.usersService.getUserBy(headers))!;
    const { prompt } = body;

    const history = await this.chatService.getHistoryChat(id);
    const pr = await this.chatService.addChat(id, 'user', prompt);

    // it take time. don't need to wait here, will have push notification to refetch later
    this.promptAi(id, prompt, history, deviceId);

    return pr;
  }

  @Get()
  @NoRoleGuard()
  async getHistory(@Headers() headers: HeadersBaseModel) {
    const userId = (await this.usersService.getUserIdBy(headers))!;

    const history = await this.transformHistoryChatAi(userId);
    return history;
  }

  @Delete('/:id')
  @NoAuthGuard()
  async deleteMessageById(@Param() param: DeleteMessageByIdParamModel) {
    const { id } = param;
    await this.chatService.deleteMessage(id);
    return null;
  }

  @Delete()
  @NoAuthGuard()
  async clearAllData() {
    await this.chatService.clearAllChatData();
    return null;
  }
}
