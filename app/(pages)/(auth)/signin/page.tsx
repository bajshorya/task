"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { GithubAuthProvider } from "firebase/auth/web-extension";
import app from "../../../../config/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

const auth = getAuth(app);
const githubProvider = new GithubAuthProvider();
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const signinWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
      router.push("/");
    } catch (err) {
      setError("Failed to sign in with Github. Please try again.");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to dashboard or home after successful login
      router.push("/");
    } catch (err) {
      setError("Failed to sign in. Please check your email and password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8ece4] text-black-100">
      <div className="bg-white shadow-lg rounded-2xl p-10 flex items-center gap-16 border-8 border-white text-black">
        <form onSubmit={handleSignIn} className="flex flex-col gap-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Log In
          </button>
          <hr className="my-2" />
          <button
            type="button"
            className="bg-black text-white py-2 rounded-lg hover:bg-slate-500 transition-all"
            onClick={signinWithGithub}
          >
            Sign In with Github
          </button>
          <button
            type="button"
            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all"
            onClick={() => router.push("/signup")}
          >
            Create New account
          </button>
        </form>
      </div>
    </div>
  );
}
