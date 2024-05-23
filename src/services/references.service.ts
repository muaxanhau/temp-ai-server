import { Injectable } from '@nestjs/common';
import { TypeReferenceEnum } from 'src/models';
import { referencesCollection } from 'src/services/firebase';

@Injectable()
export class ReferencesService {
  async add(type: TypeReferenceEnum, value: string) {
    const ref = await referencesCollection.getBy({ type });
    if (!ref.length) {
      referencesCollection.add({ type, values: [value] });
      return;
    }

    const { id, values } = ref[0];
    referencesCollection.edit(id, { values: [...values, value] });
  }
  async getAll() {
    const references = await referencesCollection.getAll();
    return references;
  }
}
