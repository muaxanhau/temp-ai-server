import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { HeadersBaseModel } from 'src/models';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { ItineraryService, UsersService } from 'src/services';
import { GetItineraryBodyModel } from './model';

@Controller('/itinerary')
export class ItineraryController {
  constructor(
    private readonly usersService: UsersService,
    private readonly itineraryService: ItineraryService,
  ) {}

  @Post()
  @NoRoleGuard()
  async getItinerary(
    @Headers() headers: HeadersBaseModel,
    @Body() body: GetItineraryBodyModel,
  ) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const {} = body;

    console.log(body);

    const data = await this.itineraryService.createBaseOnChat(userId);
    return data;
  }
}
