// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "fir-blog-8da6c.firebaseapp.com",
  projectId: "fir-blog-8da6c",
  storageBucket: "fir-blog-8da6c.firebasestorage.app",
  messagingSenderId: "119926666528",
  appId: "1:119926666528:web:d09c79042738a33a535345",
  measurementId: "G-F8ZVDR2D0C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();
export const storage = getStorage();
export const db = getFirestore(app);
