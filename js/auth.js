import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

const ADMIN_EMAIL = "admin@espana.com";

function showMessage(text, type = "success") {
  if (!message) return;
  message.className = `notice ${type}`;
  message.textContent = text;
}

async function saveUserProfile(user, role = "user") {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role,
    createdAt: new Date().toISOString()
  });
}

if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      const role = email.value.trim().toLowerCase() === ADMIN_EMAIL ? "admin" : "user";
      await saveUserProfile(userCredential.user, role);

      showMessage("Registro exitoso.", "success");
      window.location.href = role === "admin" ? "admin.html" : "reservas.html";
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value
      );

      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : "user";

      showMessage("Inicio de sesión correcto.", "success");
      window.location.href = role === "admin" ? "admin.html" : "reservas.html";
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}