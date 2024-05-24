import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
} from '@nestjs/common';
import { UsersService } from 'src/services';
import {
  AddUserBodyModel,
  AddUserResponseModel,
  DisableDeviceIdParamModel,
  DisableDeviceIdResponseModel,
  GetUserSelfResponseModel,
  SetupUserBodyModel,
  SetupUserResponseModel,
} from './models';
import { HeadersBaseModel } from 'src/models';
import { NoAuthGuard, NoRoleGuard } from 'src/decorators';
import { exceptionUtil } from 'src/utils';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @NoAuthGuard()
  @Post()
  async addUser(@Body() body: AddUserBodyModel): Promise<AddUserResponseModel> {
    const { id, role } = body;
    const user = await this.usersService.addBy(id, role);
    if (!user) return exceptionUtil.notFound();

    return user;
  }

  @NoRoleGuard()
  @Get('/self')
  async getUserSelf(
    @Headers() headers: HeadersBaseModel,
  ): Promise<GetUserSelfResponseModel> {
    const user = (await this.usersService.getUserBy(headers))!;
    return user;
  }

  @NoRoleGuard()
  @Post('/setup')
  async setupUser(
    @Headers() headers: HeadersBaseModel,
    @Body() body: SetupUserBodyModel,
  ): Promise<SetupUserResponseModel> {
    const { deviceId } = body;

    const userId = (await this.usersService.getUserIdBy(headers))!;
    await this.usersService.setDeviceId(userId, deviceId);

    return null;
  }

  @NoAuthGuard()
  @Delete('/device-id/:id')
  async disableDeviceId(
    @Param() param: DisableDeviceIdParamModel,
  ): Promise<DisableDeviceIdResponseModel> {
    const { id } = param;

    const users = await this.usersService.getBy({ deviceId: id });
    const userIds = users.map((user) => user.id);

    Promise.all(userIds.map((id) => this.usersService.setDeviceId(id, '')));

    return null;
  }
}
