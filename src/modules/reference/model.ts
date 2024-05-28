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

class TypeReference {
  @IsNotEmpty()
  @IsEnum(TypeReferenceEnum)
  type: TypeReferenceEnum;
}

//=====================================================================================================================
// addReference
export class AddReferenceQueryModel extends TypeReference {}
export class AddReferenceBodyModel {
  @IsNotEmpty()
  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  suggestions: string[];
}

//=====================================================================================================================
// addSuggestion
export class AddSuggestionQueryModel extends TypeReference {}
export class AddSuggestionBodyModel {
  @IsNotEmpty()
  @IsString()
  value: string;
}

//=====================================================================================================================
// addUserReferences
export class AddUserReferencesBodyModel {
  @IsArray()
  @IsString({ each: true })
  suggestionIds: string[];
}

//=====================================================================================================================
// addUserReferences
export class UpdateUserReferencesBodyModel {
  @IsArray()
  @IsString({ each: true })
  suggestionIds: string[];
}
