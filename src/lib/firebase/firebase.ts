
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  "projectId": "pagehub-d7aoc",
  "appId": "1:324606489173:web:31c13e35657fa2adbd5adc",
  "storageBucket": "pagehub-d7aoc.firebasestorage.app",
  "apiKey": "AIzaSyAhAoTvX6Yh8XdAnUCn1cF_Ej-nMONgPT8",
  "authDomain": "pagehub-d7aoc.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "324606489173"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
