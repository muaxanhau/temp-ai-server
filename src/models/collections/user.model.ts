import { FirestoreBaseModel } from '../base.model';
import { RoleEnum } from '../enums';

export type UserModel = {
  role: RoleEnum;
  name: string;
  email: string;
  deviceId?: string;
};
export type UserIdModel = FirestoreBaseModel<UserModel>;
