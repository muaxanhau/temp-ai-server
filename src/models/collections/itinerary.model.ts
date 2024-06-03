import { Timestamp } from 'firebase-admin/firestore';
import { FirestoreBaseModel } from '../base.model';

export type ItineraryModel = {
  userId: string;
  createdAt: Timestamp;
};
export type ItineraryIdModel = FirestoreBaseModel<ItineraryModel>;
