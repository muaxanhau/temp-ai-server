import { FirestoreBaseModel } from '../base.model';

export type UserSuggestionModel = {
  userId: string;
  suggestionIds: string[];
};
export type UserSuggestionIdModel = FirestoreBaseModel<UserSuggestionModel>;
