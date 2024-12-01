"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import styles from "@/styles/Home.module.css";

const db = getFirestore(); // Initialisation Firestore
const googleProvider = new GoogleAuthProvider(); // Fournisseur Google

export default function HomePage() {
  const [user, loading, error] = useAuthState(auth); // Gestion de l'état utilisateur
  const [role, setRole] = useState(null); // Rôle de l'utilisateur
  const [fetchingRole, setFetchingRole] = useState(false); // Indicateur de récupération du rôle
  const router = useRouter();

  // Fonction de connexion avec Google
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Utilisateur connecté :", user);

      // Référence Firestore pour cet utilisateur
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Ajouter un nouvel utilisateur dans Firestore
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName || "Utilisateur inconnu",
          profilePicture: user.photoURL || "",
          role: "pending", // Rôle par défaut
          requestStatus: [0, 0], // Statut initial
        });
        console.log("Nouvel utilisateur ajouté dans Firestore.");
        setRole("pending");
      } else {
        console.log("Utilisateur existant dans Firestore :", userDoc.data());
        setRole(userDoc.data().role); // Définit le rôle existant
      }
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        console.warn("L'utilisateur a fermé la fenêtre d'authentification.");
      } else {
        console.error("Erreur d'authentification :", err.message);
      }
    }
  };

  // Fonction pour récupérer ou créer l'utilisateur
  const fetchOrCreateUser = async (uid) => {
    setFetchingRole(true);
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        console.log("Utilisateur existant :", userDoc.data());
        setRole(userDoc.data().role); // Définit le rôle de l'utilisateur
      } else {
        console.warn("Utilisateur inexistant, création en cours...");
        await setDoc(userDocRef, {
          email: auth.currentUser?.email || "",
          name: auth.currentUser?.displayName || "Utilisateur inconnu",
          profilePicture: auth.currentUser?.photoURL || "",
          role: "pending",
          requestStatus: [0, 0],
        });
        console.log("Nouvel utilisateur ajouté !");
        setRole("pending");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération ou création de l'utilisateur :", err.message);
      setRole("error");
    } finally {
      setFetchingRole(false);
    }
  };

  // Redirection en fonction du rôle
  useEffect(() => {
    if (user && role === null) {
      fetchOrCreateUser(user.uid);
    }
  }, [user]);

  useEffect(() => {
    if (role) {
      console.log("Redirection en fonction du rôle :", role);
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "user") {
        router.push("/dashboard/user");
      } else if (role === "pending") {
        router.push("/auth/pending");
      }
    }
  }, [role, router]);

  // Gestion des états de chargement et des erreurs
  if (loading || fetchingRole) {
    return (
      <main className={styles.main}>
        <h1>Chargement...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.main}>
        <h1>Erreur : {error.message}</h1>
      </main>
    );
  }

  if (!user) {
    return (
      <main className={styles.main}>
        <h1 className={styles.heading}>Bienvenue sur AutoLend</h1>
        <button onClick={handleGoogleLogin} className={styles.loginButton}>
          Connexion avec Google
        </button>
      </main>
    );
  }

  if (role === "error") {
    return (
      <main className={styles.main}>
        <h1>Erreur lors de la récupération des données utilisateur.</h1>
        <p>Veuillez réessayer ou contacter l'administrateur.</p>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <h1>Authentification en cours...</h1>
    </main>
  );
}
