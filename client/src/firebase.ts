// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2D0wfP9Nlp03m4kHRL3dklQZa2SwuFZ4",
  authDomain: "txtgf-c0e3b.firebaseapp.com",
  databaseURL: "https://txtgf-c0e3b-default-rtdb.firebaseio.com",
  projectId: "txtgf-c0e3b",
  storageBucket: "txtgf-c0e3b.firebasestorage.app",
  messagingSenderId: "635379327738",
  appId: "1:635379327738:web:1adfc90abfaf0c21e51f43",
  measurementId: "G-REJ8RJV17H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

export const db = getDatabase(app);
export const auth = getAuth(app);
export { analytics };