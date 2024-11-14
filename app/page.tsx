import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import app from "@/config/firebase";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe; // Unsubscribe on component unmount
  }, [auth]);

  return (
    <div>
      {user ? (
        <div>Hello, {user.email}</div>
      ) : (
        <>
          <button onClick={() => router.push("/signup")}>Sign Up</button>
          <button onClick={() => router.push("/signin")}>Sign In</button>
        </>
      )}
    </div>
  );
}
