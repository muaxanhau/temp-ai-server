import { Injectable } from '@nestjs/common';
import { TypeReferenceEnum } from 'src/models';
import {
  referencesCollection,
  referencesSuggestionsCollection,
  usersSuggestionsCollection,
} from 'src/services/firebase';
import { exceptionUtil, utils } from 'src/utils';

@Injectable()
export class ReferencesService {
  private async getIdReference(type: TypeReferenceEnum) {
    const ref = await referencesCollection.getBy({ type });
    if (ref.length) {
      return ref[0].id;
    }

    const allRefs = await referencesCollection.getAll();
    if (!allRefs.length) {
      const { id } = await referencesCollection.add({
        type,
        question: '',
        sortIndex: 0,
      });
      return id;
    }
    const sortIndex = Math.max(...allRefs.map((ref) => ref.sortIndex)) + 1;
    const { id } = await referencesCollection.add({
      type,
      question: '',
      sortIndex,
    });
    return id;
  }

  async addReference(
    type: TypeReferenceEnum,
    question: string,
    suggestions: string[] = [],
  ) {
    const ref = await referencesCollection.getBy({ type });
    const isExisted = !!ref.length;
    if (isExisted) {
      return exceptionUtil.badRequest('Existed');
    }

    const allRefs = await referencesCollection.getAll();
    const sortIndex = allRefs.length
      ? Math.max(...allRefs.map((ref) => ref.sortIndex)) + 1
      : 0;
    await referencesCollection.add({ type, question, sortIndex });
    const hasSuggestions = !!suggestions.length;
    hasSuggestions && (await this.addSuggestions(type, suggestions));
  }

  async addSuggestions(type: TypeReferenceEnum, suggestions: string[]) {
    const referenceId = await this.getIdReference(type);
    await Promise.all(
      suggestions.map((suggestion) =>
        referencesSuggestionsCollection.add({
          referenceId,
          value: suggestion,
          isCustom: false,
        }),
      ),
    );
  }

  async addCustomSuggestion(type: TypeReferenceEnum, suggestion: string) {
    const referenceId = await this.getIdReference(type);
    const result = await referencesSuggestionsCollection.add({
      referenceId,
      value: suggestion,
      isCustom: true,
    });
    return result;
  }

  async updateQuestion(type: TypeReferenceEnum, question: string) {
    const referenceId = await this.getIdReference(type);
    await referencesCollection.edit(referenceId, { question });
  }

  async deleteReferenceByType(type: TypeReferenceEnum) {
    const referenceId = await this.getIdReference(type);
    await referencesCollection.delete(referenceId);
    await referencesSuggestionsCollection.deleteBy({ referenceId });
  }

  async deleteReferenceById(referenceId: string) {
    await referencesCollection.delete(referenceId);
    await referencesSuggestionsCollection.deleteBy({ referenceId });
  }

  async updateSuggestion(id: string, value: string) {
    await referencesSuggestionsCollection.edit(id, { value });
  }

  async deleteSuggestion(id: string) {
    await referencesSuggestionsCollection.delete(id);
  }

  async getDefaultReferences() {
    const references = await referencesCollection.getAll();
    const suggestions = await referencesSuggestionsCollection.getAll();

    const arrReferences: ReferenceModel[] = [];
    for (const key in TypeReferenceEnum) {
      if (!TypeReferenceEnum.hasOwnProperty(key)) continue;

      const filteredReferences = references.filter(
        (ref) => ref.type === TypeReferenceEnum[key],
      );
      const isEmpty = !filteredReferences.length;
      if (isEmpty) continue;

      const { id: referenceId, question, sortIndex } = filteredReferences[0];
      const filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.referenceId === referenceId && !suggestion.isCustom,
      );

      arrReferences.push({
        id: referenceId,
        type: TypeReferenceEnum[key],
        sortIndex,
        question,
        suggestions: filteredSuggestions.map(({ id, value }) => ({
          id,
          value,
        })),
      });
    }
    return arrReferences;
  }

  async getUserReferences(userId: string) {
    const references = await referencesCollection.getAll();
    const suggestions = await referencesSuggestionsCollection.getAll();
    const userSuggestions = await usersSuggestionsCollection.getBy({ userId });

    const userSuggestionIds = userSuggestions?.[0]?.suggestionIds || [];
    const arrReferences: ReferenceModel[] = [];
    for (const key in TypeReferenceEnum) {
      if (!TypeReferenceEnum.hasOwnProperty(key)) continue;

      const filteredReferences = references.filter(
        (ref) => ref.type === TypeReferenceEnum[key],
      );
      const isEmpty = !filteredReferences.length;
      if (isEmpty) continue;

      const { id: referenceId, question, sortIndex } = filteredReferences[0];
      const filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.referenceId === referenceId &&
          userSuggestionIds.includes(suggestion.id),
      );

      arrReferences.push({
        id: referenceId,
        type: TypeReferenceEnum[key],
        sortIndex,
        question,
        suggestions: filteredSuggestions.map(({ id, value }) => ({
          id,
          value,
        })),
      });
    }
    return arrReferences;
  }

  async addUserReferences(userId: string, suggestionIds: string[]) {
    const userSuggestions = await usersSuggestionsCollection.getBy({ userId });
    const isEmpty = !userSuggestions.length;

    if (isEmpty) {
      await usersSuggestionsCollection.add({ userId, suggestionIds });
      return;
    }

    const newSuggestionIds = utils.mergeUniqueArrays(
      userSuggestions[0].suggestionIds,
      suggestionIds,
    );
    await this.updateUserReferences(userId, newSuggestionIds);
  }
  async updateUserReferences(userId: string, suggestionIds: string[]) {
    const usersSuggestions = await usersSuggestionsCollection.getBy({
      userId,
    });
    if (!usersSuggestions.length) {
      return exceptionUtil.badRequest('Not existed');
    }

    const { id } = usersSuggestions[0];
    await usersSuggestionsCollection.edit(id, { suggestionIds });
  }
}

type ReferenceModel = {
  id: string;
  type: TypeReferenceEnum;
  sortIndex: number;
  question: string;
  suggestions: {
    id: string;
    value: string;
  }[];
};
