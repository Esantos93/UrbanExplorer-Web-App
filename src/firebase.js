// firebase.js

// initialize Firebase app
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseConfig } from "/src/firebaseConfig.js";
import { getFirestore } from "firebase/firestore";

// App
export const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth object and provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Auth functions
export function startAuthListener(onChange) {
  return onAuthStateChanged(auth, onChange);
}

export function loginWithGoogle() {
  return signInWithPopup(auth, provider);
}

export function logoutUser() {
  return signOut(auth);
}
