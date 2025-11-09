// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtk6xH6mzCCdKi2-UzJ6ZtVHrq5lTe3nM",
  authDomain: "ecofine-71cac.firebaseapp.com",
  projectId: "ecofine-71cac",
  storageBucket: "ecofine-71cac.firebasestorage.app",
  messagingSenderId: "745762511003",
  appId: "1:745762511003:web:7434b6c3ab21c170b34e3e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;