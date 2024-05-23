import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ChatIdModel } from 'src/models';

//=====================================================================================================================
// getItinerary
export class GetItineraryBodyModel {
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
  travelTypes: string[];

  @IsNotEmpty()
  @IsString()
  quantity: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  activities: string[];
}
export type GetItineraryResponseModel = ChatIdModel;
