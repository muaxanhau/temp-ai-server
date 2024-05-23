import {
  ChatModel,
  deletedLine,
  FirestoreDeletedBaseModel,
  FirestoreFullBaseModel,
  ReferencesModel,
  UserModel,
} from 'src/models';
import { AddPrefixToKeys, Timestamp } from 'firebase-admin/firestore';
import { FirestoreBaseModel } from 'src/models';
import { firebaseStore } from './config';
import { config } from 'src/config';

type QueryCollectionType = FirebaseFirestore.Query<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;
type CollectionType = FirebaseFirestore.CollectionReference<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;
type OrderBy<T> = {
  orderBy: keyof T;
  direction: FirebaseFirestore.OrderByDirection;
};
type Pagination = {
  limit: number;
  page: number;
};
type Overwrite = {
  overwrite: boolean;
};
type Options<T> = Partial<T> | void;

class Collection<T extends Object & AddPrefixToKeys<string, any>> {
  private readonly collection: CollectionType;

  private async queryPagination(
    queryCollection: QueryCollectionType,
    options: Options<Pagination>,
  ) {
    if (!options) return queryCollection;

    const { page, limit = config.limitPage } = options;
    if (page === undefined || page < 0) return queryCollection;

    let query: QueryCollectionType = queryCollection;
    if (page === 0) {
      query = query.limit(limit);
      return query;
    }

    const rawItems = await query.limit(limit * page).get();
    const lastItem = rawItems.docs[rawItems.docs.length - 1];

    query = query.startAfter(lastItem).limit(limit);
    return query;
  }

  private queryOrderBy<T>(
    queryCollection: QueryCollectionType,
    options: Options<OrderBy<T>>,
  ) {
    if (!options) return queryCollection;

    const { orderBy, direction = 'asc' } = options;
    if (!orderBy) return queryCollection;

    let query: QueryCollectionType = queryCollection;
    query = query.orderBy(orderBy as string, direction);
    return query;
  }

  private queryConditions(
    queryCollection: QueryCollectionType,
    conditions: Partial<T>,
  ) {
    let query: QueryCollectionType = queryCollection;

    const conditionsArr = Object.entries(conditions).filter(
      ([, value]) => value !== undefined && value !== '',
    );

    conditionsArr.forEach(([field, value]) => {
      query = query.where(field, '==', value);
    });

    return query;
  }

  private filterActivatedRecords(records: FirestoreFullBaseModel<T>[]) {
    const activatedRecords = records.filter(
      (record) => record[deletedLine] === undefined,
    ) as FirestoreBaseModel<T>[];
    return activatedRecords;
  }

  private filterInactivatedRecords(records: FirestoreFullBaseModel<T>[]) {
    const activatedRecords = records.filter(
      (record) => record[deletedLine] !== undefined,
    ) as FirestoreBaseModel<T>[];
    return activatedRecords;
  }

  // ==================================================================================================
  constructor(collectionName: string) {
    this.collection = firebaseStore.collection(collectionName);
  }
  // ==================================================================================================

  core() {
    return this.collection;
  }

  async exist(id: string) {
    const rawRecord = await this.collection.doc(id).get();
    const record: FirestoreFullBaseModel<T> = {
      id: rawRecord.id,
      ...(rawRecord.data() as FirestoreDeletedBaseModel<T>),
    };
    const isExisted = !record.deletedAt && rawRecord.exists;
    return isExisted;
  }

  async get(id: string) {
    const rawRecord = await this.collection.doc(id).get();
    if (!rawRecord.exists) {
      return undefined;
    }

    const record: FirestoreBaseModel<T> = {
      id: rawRecord.id,
      ...(rawRecord.data() as T),
    };
    return record;
  }

  async getAll(options: Options<Pagination & OrderBy<T>>) {
    let query: QueryCollectionType = this.collection;
    query = this.queryOrderBy(query, options);
    query = await this.queryPagination(query, options);

    const rawRecords = await query.get();
    const records: FirestoreFullBaseModel<T>[] = rawRecords.docs.map(
      (record) => ({
        id: record.id,
        ...(record.data() as FirestoreDeletedBaseModel<T>),
      }),
    );

    const activatedRecords = this.filterActivatedRecords(records);
    return activatedRecords;
  }

  async getBy(
    conditions: Partial<T>,
    options: Options<Pagination & OrderBy<T>>,
  ) {
    let query: QueryCollectionType = this.collection;
    query = this.queryConditions(query, conditions);
    query = this.queryOrderBy(query, options);
    query = await this.queryPagination(query, options);

    const rawRecords = await query.get();
    const records: FirestoreFullBaseModel<T>[] = rawRecords.docs.map(
      (record) => ({
        id: record.id,
        ...(record.data() as FirestoreDeletedBaseModel<T>),
      }),
    );

    const activatedRecords = this.filterActivatedRecords(records);
    return activatedRecords;
  }

  async add(data: T) {
    const response = await this.collection.add(data);
    const rawRecord = await response.get();
    const record: FirestoreBaseModel<T> = {
      id: rawRecord.id,
      ...(rawRecord.data() as T),
    };
    return record;
  }

  async addBy(id: string, data: T, options: Options<Overwrite>) {
    const existed = await this.exist(id);
    if (!existed) {
      await this.collection.doc(id).set(data);
      const record: FirestoreBaseModel<T> = { id, ...data };
      return record;
    }

    if (options && options.overwrite) {
      const record = await this.edit(id, data);
      return record;
    }

    const record: FirestoreBaseModel<T> = { id, ...data };
    return record;
  }

  async edit(id: string, data: Partial<T>) {
    await this.collection.doc(id).update(data);

    const record = await this.get(id);
    return record;
  }

  async delete(id: string) {
    const deletedAt = Timestamp.fromDate(new Date());
    await this.collection.doc(id).update({ deletedAt });
  }

  async deleteBy(conditions: Partial<T>) {
    let query: QueryCollectionType = this.collection;

    query = this.queryConditions(query, conditions);
    const raw = await query.get();

    const deletedAt = Timestamp.fromDate(new Date());
    await Promise.all(raw.docs.map((doc) => doc.ref.update({ deletedAt })));
  }

  async clearAllData() {
    const collectionRef = firebaseStore.collection(this.collection.path);
    const querySnapshot = await collectionRef.get();

    const batch = firebaseStore.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}

export const usersCollection = new Collection<UserModel>('users');
export const chatsCollection = new Collection<ChatModel>('chats');
export const referencesCollection = new Collection<ReferencesModel>(
  'references',
);
