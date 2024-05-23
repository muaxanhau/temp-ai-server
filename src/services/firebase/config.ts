import * as admin from 'firebase-admin';
import { config } from 'src/config';

const { projectId, privateKey, clientEmail, databaseURL } = config.firebase;

admin.initializeApp({
  credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
  databaseURL,
});

export const firebaseStore = admin.firestore();
export const firebaseAuth = admin.auth();
export const firebaseMessaging = admin.messaging();
