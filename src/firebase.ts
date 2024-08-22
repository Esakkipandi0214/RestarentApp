// Import the functions you need from the SDKs you need
import { FirebaseError, initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl7i3mhzbjFFORfnItxQAbp4iQMxlhozg",
  authDomain: "restorentapp-a6a2e.firebaseapp.com",
  projectId: "restorentapp-a6a2e",
  storageBucket: "restorentapp-a6a2e.appspot.com",
  messagingSenderId: "144772667282",
  appId: "1:144772667282:web:8a2e8b25bde41d9550934b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export {app, auth, db ,FirebaseError,signInWithEmailAndPassword};