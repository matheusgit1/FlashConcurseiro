import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const envs = {
  API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseConfig = {
  apiKey: envs.API_KEY,
  authDomain: envs.AUTH_DOMAIN,
  projectId: envs.PROJECT_ID,
  storageBucket: envs.STORAGE_BUCKET,
  messagingSenderId: envs.MESSAGING_SENDER_ID,
  appId: envs.APP_ID,
  measurementId: envs.MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
