import { Injectable } from '@nestjs/common';
import { firebaseMessaging } from './firebase';
import { RoleEnum, TriggerKeyPushNotificationEnum } from 'src/models';
import { UsersService } from './users.service';
import { config } from 'src/config';

type PushNotificationProps = {
  message: string;
  key?: TriggerKeyPushNotificationEnum;
  data?: { [key: string]: string };
};
type SendProps = {
  deviceId: string;
} & PushNotificationProps;
type SendToAllLoggedInAdminsProps = PushNotificationProps;

@Injectable()
export class PushNotificationService {
  constructor(private readonly usersService: UsersService) {}

  async send({ deviceId, message, data, key }: SendProps) {
    const title = config.appName;
    const body = message;
    try {
      await firebaseMessaging.send({
        token: deviceId,
        notification: { title, body },
        apns: { payload: { aps: { title, body } } },
        data: {
          ...data,
          key: key || '',
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async sendToAllLoggedInAdmins({
    message,
    data,
    key,
  }: SendToAllLoggedInAdminsProps) {
    const admins = await this.usersService.getBy({
      role: RoleEnum.ADMIN,
    });
    const loggedInAdmins = admins.filter((user) => !!user.deviceId?.length);
    await Promise.all(
      loggedInAdmins.map((admin) =>
        this.send({ deviceId: admin.deviceId!, message, key, data }),
      ),
    );
  }
}
