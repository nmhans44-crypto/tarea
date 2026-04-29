import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("reserva-form");
  const lista = document.getElementById("reservas-list");

  const reservasRef = collection(db, "reservas");

  // 🔥 GUARDAR RESERVA
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const nombre = document.getElementById("nombre").value;
      const fecha = document.getElementById("fecha").value;
      const hora = document.getElementById("hora").value;
      const personas = document.getElementById("personas").value;
      const nota = document.getElementById("nota").value;

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
      alert("❌ Error al guardar la reserva");
    }
  });

  // 🔥 MOSTRAR RESERVAS EN TIEMPO REAL
  onSnapshot(reservasRef, (snapshot) => {
    lista.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();

      lista.innerHTML += `
        <tr>
          <td>${data.nombre}</td>
          <td>${data.fecha}</td>
          <td>${data.hora}</td>
          <td>${data.personas}</td>
          <td>${data.estado}</td>
        </tr>
      `;
    });
  });

  // 🔥 MESAS (VISUAL)
  const mesas = document.querySelectorAll(".mesa");

  mesas.forEach(mesa => {
    mesa.addEventListener("click", () => {
      mesa.classList.toggle("ocupada");
      mesa.classList.toggle("libre");
    });
  });

});