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
import { HeadersBaseModel, TypeReferenceEnum } from 'src/models';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { ReferencesService } from 'src/services';
import { AddReferenceBodyModel, AddReferenceQueryModel } from './model';

@Controller('/references')
export class ReferenceController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Post()
  @NoAuthGuard()
  async addReference(
    @Query() query: AddReferenceQueryModel,
    @Body() body: AddReferenceBodyModel,
  ) {
    const { type } = query;
    const { value } = body;
    this.referencesService.add(type, value);

    return null;
  }

  @Get()
  @NoAuthGuard()
  async getReferences() {
    const references = await this.referencesService.getAll();

    const objReferences = {};
    for (const key in TypeReferenceEnum) {
      if (TypeReferenceEnum.hasOwnProperty(key)) {
        objReferences[TypeReferenceEnum[key]] = [];
      }
    }
    references.forEach((ref) => {
      objReferences[ref.type] = ref.values;
    });

    return objReferences;
  }
}
