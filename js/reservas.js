import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reserva-form");

  // 🔥 GUARDAR RESERVA CON VALIDACIÓN
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombre = document.getElementById("nombre").value;
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora").value;
      const personas = document.getElementById("personas").value;
      const nota = document.getElementById("nota").value;

      const reservasRef = collection(db, "reservas");
      const snapshot = await getDocs(reservasRef);

      let ocupado = false;

      snapshot.forEach(doc => {
        const data = doc.data();

        if (data.fecha === fecha && data.hora === hora) {
          ocupado = true;
        }
      });

      if (ocupado) {
        alert("❌ Ya existe una reserva en esa fecha y hora");
        return;
      }

      await addDoc(reservasRef, {
        nombre,
        fecha,
        hora,
        personas,
        nota,
        estado: "pendiente"
      });

      alert("✅ Reserva guardada correctamente");
      form.reset();

    } catch (error) {
      console.error("🔥 ERROR REAL:", error);
      alert(error.message); // 👈 AHORA VERÁS EL ERROR REAL
    }
  });

  // 🔥 MESAS VISUALES
  const mesas = document.querySelectorAll(".mesa");

  mesas.forEach(mesa => {
    mesa.addEventListener("click", () => {
      mesa.classList.toggle("ocupada");
      mesa.classList.toggle("libre");
    });
  });

});