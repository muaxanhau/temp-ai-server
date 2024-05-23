import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleEnum, UserIdModel } from 'src/models';

//=====================================================================================================================
// addUser
export class AddUserBodyModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
export type AddUserResponseModel = UserIdModel;

//=====================================================================================================================
// getUserSelf
export type GetUserSelfResponseModel = UserIdModel;

//=====================================================================================================================
// setupUser
export class SetupUserBodyModel {
  @IsNotEmpty()
  @IsString()
  deviceId: string;
}
export type SetupUserResponseModel = null;

//=====================================================================================================================
// disableDeviceId

export class DisableDeviceIdParamModel {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export type DisableDeviceIdResponseModel = null;
