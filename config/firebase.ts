// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO99ub1hjxdBpGhG-YE3ZZXVw-vr8uJ4o",
  authDomain: "taskmanagementsystem-50d79.firebaseapp.com",
  projectId: "taskmanagementsystem-50d79",
  storageBucket: "taskmanagementsystem-50d79.firebasestorage.app",
  messagingSenderId: "947182204873",
  appId: "1:947182204873:web:ba002a6c862eefbf671a18",
  measurementId: "G-SEZP04CLS1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export default app;
export { auth, analytics };
