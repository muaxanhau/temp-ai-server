import { FirestoreBaseModel } from '../base.model';
import { TypeReferenceEnum } from '../enums';

export type ReferencesModel = {
  type: TypeReferenceEnum;
  question: string;
};
export type ReferencesIdModel = FirestoreBaseModel<ReferencesModel>;
