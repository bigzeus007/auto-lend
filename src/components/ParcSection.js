"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function ParcSection() {
  const [vehicles, setVehicles] = useState([]);
  const [newVehicle, setNewVehicle] = useState({ brand: "", model: "", plate: "", status: "Disponible" });
  const [editVehicle, setEditVehicle] = useState(null);

  const vehiclesCollection = collection(db, "vehicles");

  // Récupérer les véhicules depuis Firestore
  const fetchVehicles = async () => {
    const data = await getDocs(vehiclesCollection);
    setVehicles(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Ajouter un nouveau véhicule
  const handleAddVehicle = async () => {
    try {
      const newVehicle = {
        brand: "BMW",
        model: "X5",
        ownerId: auth.currentUser.uid, // Assurez-vous que ce champ est présent
      };
      await addDoc(collection(db, "vehicles"), newVehicle);
      console.log("Véhicule ajouté !");
    } catch (err) {
      console.error("Erreur lors de l'ajout du véhicule :", err.message);
    }
  };

  // Modifier un véhicule
  const handleEditVehicle = async () => {
    if (!editVehicle.brand || !editVehicle.model || !editVehicle.plate) {
      alert("Tous les champs sont obligatoires !");
      return;
    }
    const vehicleDoc = doc(db, "vehicles", editVehicle.id);
    await updateDoc(vehicleDoc, editVehicle);
    setEditVehicle(null);
    fetchVehicles();
  };

  // Supprimer un véhicule
  const handleDeleteVehicle = async (id) => {
    const vehicleDoc = doc(db, "vehicles", id);
    await deleteDoc(vehicleDoc);
    fetchVehicles();
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div>
      <h2>Gestion du parc de véhicules</h2>

      {/* Formulaire pour ajouter un véhicule */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Ajouter un véhicule</h3>
        <input
          type="text"
          placeholder="Marque"
          value={newVehicle.brand}
          onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
        />
        <input
          type="text"
          placeholder="Modèle"
          value={newVehicle.model}
          onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
        />
        <input
          type="text"
          placeholder="Plaque"
          value={newVehicle.plate}
          onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
        />
        <button onClick={handleAddVehicle}>Ajouter</button>
      </div>

      {/* Liste des véhicules */}
      <h3>Liste des véhicules</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Plaque</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.brand}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.plate}</td>
              <td>{vehicle.status}</td>
              <td>
                <button onClick={() => setEditVehicle(vehicle)}>Modifier</button>
                <button onClick={() => handleDeleteVehicle(vehicle.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulaire de modification */}
      {editVehicle && (
        <div>
          <h3>Modifier un véhicule</h3>
          <input
            type="text"
            placeholder="Marque"
            value={editVehicle.brand}
            onChange={(e) => setEditVehicle({ ...editVehicle, brand: e.target.value })}
          />
          <input
            type="text"
            placeholder="Modèle"
            value={editVehicle.model}
            onChange={(e) => setEditVehicle({ ...editVehicle, model: e.target.value })}
          />
          <input
            type="text"
            placeholder="Plaque"
            value={editVehicle.plate}
            onChange={(e) => setEditVehicle({ ...editVehicle, plate: e.target.value })}
          />
          <button onClick={handleEditVehicle}>Enregistrer</button>
          <button onClick={() => setEditVehicle(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
}
