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
  apiKey: "AIzaSyDsLO2q0R3qwMmlT359kGcd48guiUywLyc",
  authDomain: "flash-cards-95ee8.firebaseapp.com",
  projectId: "flash-cards-95ee8",
  storageBucket: "flash-cards-95ee8.firebasestorage.app",
  messagingSenderId: "800453227858",
  appId: "1:800453227858:web:a15151cc08d9f0f45bb68b",
  measurementId: "G-LL9N6WTVMF",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
