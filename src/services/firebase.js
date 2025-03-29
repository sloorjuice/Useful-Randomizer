// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhjGRdoWA1vBH94tyxcxsVmBgOAgd4uD0",
  authDomain: "randomizer-7735a.firebaseapp.com",
  projectId: "randomizer-7735a",
  storageBucket: "randomizer-7735a.firebasestorage.app",
  messagingSenderId: "75571128285",
  appId: "1:75571128285:web:c88ee032a7aea323d9f834",
  measurementId: "G-7VXKB8XCS1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app); // Export the auth instance
export const db = getFirestore(app); // Export the Firestore instance