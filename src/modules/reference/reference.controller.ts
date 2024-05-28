import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { HeadersBaseModel, TypeReferenceEnum } from 'src/models';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { ReferencesService, UsersService } from 'src/services';
import {
  AddReferenceBodyModel,
  AddReferenceQueryModel,
  AddSuggestionBodyModel,
  AddSuggestionQueryModel,
  AddUserReferencesBodyModel,
  UpdateUserReferencesBodyModel,
} from './model';

@Controller('/references')
export class ReferenceController {
  constructor(
    private readonly referencesService: ReferencesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @NoAuthGuard()
  async addReference(
    @Query() query: AddReferenceQueryModel,
    @Body() body: AddReferenceBodyModel,
  ) {
    const { type } = query;
    const { question, suggestions } = body;
    await this.referencesService.addReference(type, question, suggestions);
    return null;
  }

  @Post('/suggestions')
  @NoAuthGuard()
  async addSuggestion(
    @Query() query: AddSuggestionQueryModel,
    @Body() body: AddSuggestionBodyModel,
  ) {
    const { type } = query;
    const { value } = body;
    await this.referencesService.addSuggestions(type, [value]);
    return null;
  }

  @Post('/custom-suggestions')
  @NoAuthGuard()
  async addCustomSuggestion(
    @Query() query: AddSuggestionQueryModel,
    @Body() body: AddSuggestionBodyModel,
  ) {
    const { type } = query;
    const { value } = body;
    const response = await this.referencesService.addCustomSuggestion(
      type,
      value,
    );
    return response;
  }

  @Get()
  @NoAuthGuard()
  async getDefaultReferences() {
    const references = await this.referencesService.getDefaultReferences();
    return {
      greetings:
        'Hi there, welcome to Travel Itinerary Planner, I will help you create your travel plan',
      references,
    };
  }

  @Get('/users')
  @NoRoleGuard()
  async getUserReferences(@Headers() headers: HeadersBaseModel) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const references = await this.referencesService.getUserReferences(userId);
    return references;
  }

  @Post('/users')
  @NoRoleGuard()
  async addUserReferences(
    @Headers() headers: HeadersBaseModel,
    @Body() body: AddUserReferencesBodyModel,
  ) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const { suggestionIds } = body;

    await this.referencesService.addUserReferences(userId, suggestionIds);
    return null;
  }

  @Put('/users')
  @NoRoleGuard()
  async updateUserReferences(
    @Headers() headers: HeadersBaseModel,
    @Body() body: UpdateUserReferencesBodyModel,
  ) {
    const userId = (await this.usersService.getUserIdBy(headers))!;
    const { suggestionIds } = body;

    await this.referencesService.updateUserReferences(userId, suggestionIds);
    return null;
  }
}
