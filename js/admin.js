import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const adminInfo = document.getElementById("admin-info");
const reservasTable = document.getElementById("admin-reservas");

function renderRows(items) {
  if (!reservasTable) return;

  reservasTable.innerHTML = items.length
    ? items.map((r) => `
      <tr>
        <td>${r.nombre}</td>
        <td>${r.email || ""}</td>
        <td>${r.fecha}</td>
        <td>${r.hora}</td>
        <td>${r.personas}</td>
        <td>${r.estado || "pendiente"}</td>
        <td>
          <button class="btn-action" data-id="${r.id}" data-action="ok">Aprobar</button>
          <button class="btn-action danger" data-id="${r.id}" data-action="del">Eliminar</button>
        </td>
      </tr>
    `).join("")
    : `<tr><td colspan="7">No hay reservas.</td></tr>`;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  const role = userDoc.exists() ? userDoc.data().role : "user";

  if (role !== "admin") {
    window.location.href = "reservas.html";
    return;
  }

  if (adminInfo) {
    adminInfo.textContent = `Admin conectado: ${user.email}`;
  }

  onSnapshot(collection(db, "reservas"), (snapshot) => {
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderRows(items);
  });
});

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-action");
  if (!btn) return;

  const id = btn.dataset.id;
  const action = btn.dataset.action;

  try {
    if (action === "del") {
      await deleteDoc(doc(db, "reservas", id));
    }

    if (action === "ok") {
      await updateDoc(doc(db, "reservas", id), { estado: "aprobada" });
    }
  } catch (error) {
    alert(error.message);
  }
});