import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAr3arskRQdXyBhC1WBQBhFiPIA3l-fWzA",
  authDomain: "madhayana-80f71.firebaseapp.com",
  projectId: "madhayana-80f71",
  storageBucket: "madhayana-80f71.firebasestorage.app",
  messagingSenderId: "948236566177",
  appId: "1:948236566177:web:c39b7a78876e72760d7ae0",
  measurementId: "G-8C0DB7EGYZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export default app;
