import { Injectable } from '@nestjs/common';
import { firebaseAuth, usersCollection } from 'src/services/firebase';
import { HeadersBaseModel, RoleEnum, UserModel } from 'src/models';
import { config } from 'src/config';

@Injectable()
export class UsersService {
  async addBy(id: string, role: RoleEnum) {
    const { displayName, email } = await firebaseAuth.getUser(id);
    const user = await usersCollection.addBy(id, {
      role,
      name: displayName,
      email,
    });
    return user;
  }

  async get(id: string) {
    const user = await usersCollection.get(id);
    return user;
  }

  async getBy(conditions: Partial<UserModel>) {
    const user = await usersCollection.getBy(conditions);
    return user;
  }

  async getUserIdBy(headers: HeadersBaseModel) {
    const token = headers[config.tokenName];

    try {
      const { uid } = await firebaseAuth.verifyIdToken(token);
      return uid;
    } catch (error) {
      return undefined;
    }
  }

  async getUserBy(headers: HeadersBaseModel) {
    const id = await this.getUserIdBy(headers);
    if (!id) return undefined;

    const user = await usersCollection.get(id);
    return user;
  }

  async getAll() {
    const users = await usersCollection.getAll();
    return users;
  }

  async setDeviceId(userId: string, deviceId: string) {
    await usersCollection.edit(userId, { deviceId });
  }
}
