import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

//=====================================================================================================================
// getItineraryFromReference
export class GetItineraryFromReferenceBodyModel {
  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  styles: string[];

  @IsNotEmpty()
  @IsString()
  member: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  activities: string[];
}

//=====================================================================================================================
// getItinerary
export class GetItineraryParamModel {
  @IsNotEmpty()
  @IsString()
  id: string;
}

//=====================================================================================================================
// getItinerary
export class StoreItineraryBodyModel {
  @IsNotEmpty()
  @IsString()
  itineraryId: string;
}
