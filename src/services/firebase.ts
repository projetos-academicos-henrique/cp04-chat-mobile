import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export const firebaseConfig = {
  apiKey: "AIzaSyCvZnkV0e2pQQy8f-Vi_1E6zi0R1YwIEvI",
  authDomain: "cp4-chat-firebase.firebaseapp.com",
  projectId: "cp4-chat-firebase",
  storageBucket: "cp4-chat-firebase.firebasestorage.app",
  messagingSenderId: "728568901615",
  appId: "1:728568901615:web:091ed4272ec3be353e501a"
};


export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getDatabase(app);
