import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const logoutBtn = document.getElementById("logout-btn");
const authLink = document.getElementById("auth-link");
const adminLink = document.getElementById("admin-link");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

onAuthStateChanged(auth, (user) => {
  if (authLink) {
    authLink.textContent = user ? "Mi cuenta" : "Login";
    authLink.href = user ? "reservas.html" : "login.html";
  }

  if (!user && adminLink) {
    adminLink.classList.add("hidden");
  }
});