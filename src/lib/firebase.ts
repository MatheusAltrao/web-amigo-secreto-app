/* eslint-disable prettier/prettier */
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import "server-only";

const decodedKey = Buffer.from(
  process.env.FIREBASE_PRIVATE_KEY_BASE64 as string,
  "base64"
).toString("utf-8");

export const firebaseCert = cert({
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: decodedKey,
});

if (!getApps().length) {
  initializeApp({
    credential: firebaseCert,
  });
}

export const db = getFirestore();
