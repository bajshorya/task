import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCO99ub1hjxdBpGhG-YE3ZZXVw-vr8uJ4o",
  authDomain: "taskmanagementsystem-50d79.firebaseapp.com",
  projectId: "taskmanagementsystem-50d79",
  storageBucket: "taskmanagementsystem-50d79.firebasestorage.app",
  messagingSenderId: "947182204873",
  appId: "1:947182204873:web:ba002a6c862eefbf671a18",
  measurementId: "G-SEZP04CLS1",
};

const app = initializeApp(firebaseConfig);
export default app;
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export { analytics };

export const addTaskToFirestore = async (taskData: TaskData) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        userId: user.uid,
      });
    } else {
      console.error("npt logged in");
    }
  } catch (error) {
    console.error("Error ", error);
  }
};

export interface TaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "To Do" | "In Progress" | "Completed";
}
