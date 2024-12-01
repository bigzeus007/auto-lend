"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import ParcSection from "../../../components/ParcSection";
import MaintenanceSection from "../../../components/MaintenanceSection";
import ReservationsSection from "../../../components/ReservationsSection";
import UsersSection from "../../../components/UsersSection";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("parc");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Déconnexion réussie");
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <header style={{ marginBottom: "20px" }}>
        <h1>Tableau de bord Admin</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Déconnexion
        </button>
      </header>
      <nav style={styles.nav}>
        <button onClick={() => setActiveSection("parc")} style={styles.navButton}>
          Parc de véhicules
        </button>
        <button onClick={() => setActiveSection("maintenance")} style={styles.navButton}>
          Maintenance
        </button>
        <button onClick={() => setActiveSection("reservations")} style={styles.navButton}>
          Réservations
        </button>
        <button onClick={() => setActiveSection("utilisateurs")} style={styles.navButton}>
          Gestion des utilisateurs
        </button>
      </nav>
      <main style={styles.main}>
        {activeSection === "parc" && <ParcSection />}
        {activeSection === "maintenance" && <MaintenanceSection />}
        {activeSection === "reservations" && <ReservationsSection />}
        {activeSection === "utilisateurs" && <UsersSection />}
      </main>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  navButton: {
    padding: "10px 15px",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  main: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  },
  logoutButton: {
    padding: "10px 15px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
