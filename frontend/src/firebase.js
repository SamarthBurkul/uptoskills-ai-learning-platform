import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "uptoskills-ai-learning.firebaseapp.com",
  projectId: "uptoskills-ai-learning",
  storageBucket: "uptoskills-ai-learning.firebasestorage.app",
  messagingSenderId: "954014117432",
  appId: "1:954014117432:web:29df6356b44eff7392c0cd",
  measurementId: "G-T5EDHYBBZH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup };
