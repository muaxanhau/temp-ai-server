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
import {
  GetItineraryFromReferenceBodyModel,
  GetItineraryParamModel,
  StoreItineraryBodyModel,
} from './model';
import { exceptionUtil } from 'src/utils';

@Controller('/itinerary')
export class ItineraryController {
  constructor(
    private readonly usersService: UsersService,
    private readonly itineraryService: ItineraryService,
  ) {}

  @Get('/:id')
  @NoAuthGuard()
  async getItinerary(@Param() param: GetItineraryParamModel) {
    const { id } = param;
    const data = await this.itineraryService.getItinerary(id);
    return data;
  }

  @Get()
  @NoRoleGuard()
  async getItineraryByUserId(@Headers() headers: HeadersBaseModel) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const data = await this.itineraryService.getItineraryByUserId(userId);
    return data;
  }

  @Post()
  @NoRoleGuard()
  async storeItinerary(
    @Headers() headers: HeadersBaseModel,
    @Body() body: StoreItineraryBodyModel,
  ) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const { itineraryId } = body;

    const data = await this.itineraryService.storeItineraryWithUserId(
      userId,
      itineraryId,
    );
    return data;
  }

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
