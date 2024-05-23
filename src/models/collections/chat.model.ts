import { Timestamp } from 'firebase-admin/firestore';
import { FirestoreBaseModel } from '../base.model';

export type ChatRole = 'user' | 'ai';
export type ChatModel = {
  userId: string;
  role: ChatRole;
  text: string;
  createdAt: Timestamp;
};
export type ChatIdModel = FirestoreBaseModel<ChatModel>;
