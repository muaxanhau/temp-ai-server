import { FirestoreBaseModel } from '../base.model';

export type ReferenceSuggestionModel = {
  referenceId: string;
  value: string;
  isCustom: boolean;
};
export type ReferenceSuggestionIdModel =
  FirestoreBaseModel<ReferenceSuggestionModel>;
