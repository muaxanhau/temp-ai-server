import { Controller, Get, Post, Headers, Req } from '@nestjs/common';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { HeadersBaseModel } from 'src/models';
import { gemini, PushNotificationService, UsersService } from 'src/services';
import {
  GetStripePaymentResponse,
  PushNotificationResponse,
  UnauthorizeResponse,
} from './models';
import { exceptionUtils, utils } from 'src/utils';

@Controller('/tests')
export class TestsController {
  constructor(
    private readonly usersService: UsersService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @NoAuthGuard()
  @Get()
  async test(): Promise<UnauthorizeResponse> {
    console.log(gemini.base.safetySettings);
    return null;
  }

  @NoRoleGuard()
  @Post('/push-notification')
  async pushNotification(
    @Headers() headers: HeadersBaseModel,
  ): Promise<PushNotificationResponse> {
    const { deviceId } = (await this.usersService.getUserBy(headers))!;
    if (!deviceId?.length) return null;

    const message = 'Message from PN server';
    this.pushNotificationService.send({ deviceId, message });

    return null;
  }

  @NoRoleGuard()
  @Get('/unauthorize')
  async unauthorize(): Promise<UnauthorizeResponse> {
    return exceptionUtils.unauthorized();
  }
}
