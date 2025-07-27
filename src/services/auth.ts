
'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export async function signUpUser(email: string, password: string):Promise<void> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign up.');
  }
}

export async function signInUser(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password.');
    }
    throw new Error(error.message || 'Failed to sign in.');
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out.');
  }
}
