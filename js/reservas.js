import { db } from "./firebase.js";
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reserva-form");

  // 🔥 GUARDAR RESERVA (SIMPLE Y FUNCIONANDO)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombre = document.getElementById("nombre").value;
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora").value;
      const personas = document.getElementById("personas").value;
      const nota = document.getElementById("nota").value;

      await addDoc(collection(db, "reservas"), {
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
      alert("❌ Error al guardar la reserva");
    }
  });

  // 🔥 MESAS (SOLO VISUAL)
  const mesas = document.querySelectorAll(".mesa");

  mesas.forEach(mesa => {
    mesa.addEventListener("click", () => {
      mesa.classList.toggle("ocupada");
      mesa.classList.toggle("libre");
    });
  });

});