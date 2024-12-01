"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function UsersSection() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les utilisateurs depuis Firestore
  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const data = await getDocs(usersCollection);
      const usersList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setUsers(usersList);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <div>Chargement des utilisateurs...</div>;
  }

  return (
    <div>
      <h2>Gestion des utilisateurs</h2>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Photo</th>
            <th>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name || "N/A"}</td>
              <td>{user.email}</td>
              <td>
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" width="50" />
                ) : (
                  "Pas de photo"
                )}
              </td>
              <td>{user.role || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
