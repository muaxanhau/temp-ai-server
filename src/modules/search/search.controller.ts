import { Controller, Get, Post, Headers, Req, Query } from '@nestjs/common';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { HeadersBaseModel } from 'src/models';
import { gemini, PushNotificationService, UsersService } from 'src/services';
import { exceptionUtil, utils } from 'src/utils';
import { SearchPlaceQueryModel } from './models';

@Controller('/search')
export class SearchController {
  constructor() {}

  @NoAuthGuard()
  @Get('/places')
  async searchPlace(@Query() query: SearchPlaceQueryModel) {
    const { value } = query;

    const prompt = `
    Find places in the world for travel that start with the characters: ${value}.
    Create data based on the format below: 
    string[]
    Only output the data in JSON format, maximum is 10 places.`;
    const result = await gemini.base.generateContent(prompt);
    const text = result.response.text();
    const places = utils.stringToObjectJson<string[]>(text, []);
    const uniquePlaces = utils.mergeUniqueArrays(places);
    return uniquePlaces;
  }
}
