
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from 'firebase/auth';
import { app } from './firebase';

export const auth = getAuth(app);

export type LoginCredentials = Parameters<typeof signInWithEmailAndPassword>[2];
export type SignupCredentials = Parameters<typeof createUserWithEmailAndPassword>[2];

export async function login({ email, password }: LoginCredentials) {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signup({ email, password }: SignupCredentials) {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
