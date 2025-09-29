// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${import.meta.env.VITE_FIREBASE_API_KEY!}`,
  authDomain: "restorentapp-a6a2e.firebaseapp.com",
  projectId: "restorentapp-a6a2e",
  storageBucket: "restorentapp-a6a2e.appspot.com",
  messagingSenderId: "144772667282",
  appId: `${import.meta.env.VITE_FIREBASE_API_ID!}`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {app, auth, db ,FirebaseError,signInWithEmailAndPassword};