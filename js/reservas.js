import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const form = document.getElementById("reserva-form");
const message = document.getElementById("message");
const reservasList = document.getElementById("reservas-list");
const userInfo = document.getElementById("user-info");

let currentUser = null;
let allReservations = [];

function showMessage(text, type = "success") {
  if (!message) return;
  message.className = `notice ${type}`;
  message.textContent = text;
}

function renderUserReservations() {
  if (!reservasList || !currentUser) return;

  const mine = allReservations.filter(r => r.userId === currentUser.uid);

  reservasList.innerHTML = mine.length
    ? mine.map((r) => `
      <tr>
        <td>${r.nombre}</td>
        <td>${r.fecha}</td>
        <td>${r.hora}</td>
        <td>${r.personas}</td>
        <td>${r.estado || "pendiente"}</td>
      </tr>
    `).join("")
    : `<tr><td colspan="5">Aún no tienes reservas.</td></tr>`;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  if (userInfo) {
    userInfo.textContent = `Sesión iniciada como: ${user.email}`;
  }

  onSnapshot(collection(db, "reservas"), (snapshot) => {
    allReservations = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderUserReservations();
  });
});

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;
    const personas = document.getElementById("personas").value;
    const nota = document.getElementById("nota").value.trim();

    const duplicada = allReservations.some(
      (r) => r.fecha === fecha && r.hora === hora
    );

    if (duplicada) {
      showMessage("Esa fecha y hora ya están ocupadas.", "error");
      return;
    }

    try {
      await addDoc(collection(db, "reservas"), {
        nombre,
        fecha,
        hora,
        personas,
        nota,
        userId: currentUser.uid,
        email: currentUser.email,
        estado: "pendiente",
        createdAt: serverTimestamp()
      });

      form.reset();
      showMessage("Reserva guardada correctamente.", "success");
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}
document.querySelectorAll(".mesa").forEach(mesa => {
  mesa.addEventListener("click", () => {
    mesa.classList.toggle("ocupada");
    mesa.classList.toggle("libre");
  });
});