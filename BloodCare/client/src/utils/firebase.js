import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAEXpdBqhZKS9fJzcP96KBCVfi5qK8Q0j0",
  authDomain: "bloodcare-a5d35.firebaseapp.com",
  projectId: "bloodcare-a5d35",
  storageBucket: "bloodcare-a5d35.firebasestorage.app",
  messagingSenderId: "304200831226",
  appId: "1:304200831226:web:feba91cd90626733eef943",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
