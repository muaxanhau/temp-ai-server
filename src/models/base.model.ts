import { IsNotEmpty, IsString } from 'class-validator';
import { Timestamp } from 'firebase-admin/firestore';
import { tokenName } from 'src/config';

/**
 * response collection for firebase model
 */
export const deletedLine = 'deletedAt' as const;
type FirestoreId = {
  id: string;
};
type FirestoreDeleted = {
  [deletedLine]?: Timestamp;
};
export type FirestoreBaseModel<T> = FirestoreId & T;
export type FirestoreDeletedBaseModel<T> = FirestoreDeleted & T;
export type FirestoreFullBaseModel<T> = FirestoreId & FirestoreDeleted & T;

type ResponseBaseModel<T> = {
  method: string;
  path: string;
  timestamp: Date;
  message: string[];
  data: T;
};

/**
 *
 */
export type ErrorResponseBaseModel = ResponseBaseModel<null>;

/**
 *
 */
export type SuccessResponseBaseModel<T = null> = ResponseBaseModel<T>;

export type PaginationResponseBaseModel<T> = {
  totalPage: number;
  nextPage: number;
  prevPage: number;
} & T;

export class HeadersBaseModel {
  @IsNotEmpty()
  @IsString()
  [tokenName]: string;
}
