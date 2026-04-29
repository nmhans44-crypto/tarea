import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reserva-form");

  // 🔥 GUARDAR RESERVA CON VALIDACIÓN
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const personas = document.getElementById("personas").value;
    const nota = document.getElementById("nota").value;

    try {
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
        alert("❌ Ya hay una reserva en esa fecha y hora");
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
      console.error(error);
      alert("Error al guardar la reserva");
    }
  });

  // 🔥 MESAS (visual)
  const mesas = document.querySelectorAll(".mesa");

  mesas.forEach(mesa => {
    mesa.addEventListener("click", () => {
      mesa.classList.toggle("ocupada");
      mesa.classList.toggle("libre");
    });
  });

});