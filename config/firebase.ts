import dotenv from "dotenv";

dotenv.config();

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
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export default app;
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
// export { analytics };

export const addTaskToFirestore = async (taskData: TaskData) => {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        userId: user.uid,
      });
    } else {
      console.error("User is not logged in");
    }
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

export interface TaskData {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  status: "To Do" | "In Progress" | "Completed";
}
