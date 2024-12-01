"use client";

import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    try {
      console.log("Tentative d'ouverture de la fenêtre d'authentification...");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Utilisateur authentifié :", user);
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        console.warn("La fenêtre d'authentification a été fermée par l'utilisateur.");
      } else {
        console.error("Erreur d'authentification :", err.message);
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log("Utilisateur connecté : ", result.user);
    } catch (error) {
      console.error("Erreur d'authentification Facebook : ", error);
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <button onClick={handleGoogleLogin}>Se connecter avec Google</button>
      <button onClick={handleFacebookLogin}>Se connecter avec Facebook</button>
    </div>
  );
}