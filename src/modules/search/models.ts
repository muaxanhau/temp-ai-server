import { IsNotEmpty, IsString } from 'class-validator';

//=====================================================================================================================
// searchPlace
export class SearchPlaceQueryModel {
  @IsNotEmpty()
  @IsString()
  value: string;
}
