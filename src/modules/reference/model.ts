import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ChatIdModel, TypeReferenceEnum } from 'src/models';

//=====================================================================================================================
// addReference
export class AddReferenceQueryModel {
  @IsNotEmpty()
  @IsEnum(TypeReferenceEnum)
  type: TypeReferenceEnum;
}
export class AddReferenceBodyModel {
  @IsNotEmpty()
  @IsString()
  value: string;
}
