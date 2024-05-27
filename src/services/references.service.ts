import { Injectable } from '@nestjs/common';
import { TypeReferenceEnum } from 'src/models';
import {
  referencesCollection,
  referencesSuggestionsCollection,
  usersSuggestionsCollection,
} from 'src/services/firebase';
import { exceptionUtil } from 'src/utils';

@Injectable()
export class ReferencesService {
  private async getIdReference(type: TypeReferenceEnum) {
    const ref = await referencesCollection.getBy({ type });
    const { id } = !ref.length
      ? await referencesCollection.add({ type, question: '' })
      : ref[0];
    return id;
  }

  async addReference(
    type: TypeReferenceEnum,
    question: string,
    suggestions: string[] = [],
  ) {
    const ref = await referencesCollection.getBy({ type });
    const isExisted = !!ref.length;
    if (isExisted) return;

    await referencesCollection.add({ type, question });
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

  async getAllDefault() {
    const references = await referencesCollection.getAll();
    const suggestions = await referencesSuggestionsCollection.getAll();

    const objReferences = {};
    for (const key in TypeReferenceEnum) {
      if (!TypeReferenceEnum.hasOwnProperty(key)) continue;

      const filteredReferences = references.filter(
        (ref) => ref.type === TypeReferenceEnum[key],
      );
      const isEmpty = !filteredReferences.length;
      if (isEmpty) {
        objReferences[TypeReferenceEnum[key]] = {
          id: '',
          question: '',
          suggestions: [],
        };
        continue;
      }
      const { id: referenceId, question } = filteredReferences[0];
      const filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.referenceId === referenceId && !suggestion.isCustom,
      );

      objReferences[TypeReferenceEnum[key]] = {
        id: referenceId,
        question,
        suggestions: filteredSuggestions.map(({ id, value }) => ({
          id,
          value,
        })),
      };
    }
    return objReferences;
  }

  async getUserReferences(userId: string) {
    const references = await referencesCollection.getAll();
    const suggestions = await referencesSuggestionsCollection.getAll();
    const userSuggestions = await usersSuggestionsCollection.getBy({ userId });

    if (!userSuggestions.length) return exceptionUtil.badRequest();

    const userSuggestionIds = userSuggestions[0].suggestionIds;

    const objReferences = {};
    for (const key in TypeReferenceEnum) {
      if (!TypeReferenceEnum.hasOwnProperty(key)) continue;

      const filteredReferences = references.filter(
        (ref) => ref.type === TypeReferenceEnum[key],
      );
      const isEmpty = !filteredReferences.length;
      if (isEmpty) {
        objReferences[TypeReferenceEnum[key]] = {
          id: '',
          question: '',
          suggestions: [],
        };
        continue;
      }
      const { id: referenceId, question } = filteredReferences[0];
      const filteredSuggestions = suggestions.filter(
        (suggestion) =>
          suggestion.referenceId === referenceId &&
          userSuggestionIds.includes(suggestion.id),
      );

      objReferences[TypeReferenceEnum[key]] = {
        id: referenceId,
        question,
        suggestions: filteredSuggestions.map(({ id, value }) => ({
          id,
          value,
        })),
      };
    }
    return objReferences;
  }

  async addUserReferences(userId: string, suggestionIds: string[]) {
    await usersSuggestionsCollection.add({ userId, suggestionIds });
  }
  async updateUserReferences(userId: string, suggestionIds: string[]) {
    const usersSuggestionsList = await usersSuggestionsCollection.getBy({
      userId,
    });
    if (!usersSuggestionsList.length) return;

    const { id } = usersSuggestionsList[0];
    await usersSuggestionsCollection.edit(id, { suggestionIds });
  }
}
