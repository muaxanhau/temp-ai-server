import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { HeadersBaseModel } from 'src/models';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { ItineraryService, UsersService } from 'src/services';
import { GetItineraryFromReferenceBodyModel } from './model';
import { exceptionUtil } from 'src/utils';

@Controller('/itinerary')
export class ItineraryController {
  constructor(
    private readonly usersService: UsersService,
    private readonly itineraryService: ItineraryService,
  ) {}

  @Post('/from-chats')
  @NoRoleGuard()
  async getItineraryFromChat(@Headers() headers: HeadersBaseModel) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const data = await this.itineraryService.generateBaseOnChat(userId);
    return data;
  }

  @Post('/from-references')
  @NoAuthGuard()
  async getItineraryFromReference(
    @Body() body: GetItineraryFromReferenceBodyModel,
  ) {
    const data = await this.itineraryService.generateBaseOnReference(body);
    return data;
  }
}
