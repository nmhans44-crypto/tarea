import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAA8W1bVggBXjrMvk7ldYr2wIQj3Q2BJJg",
  authDomain: "restaurante-b3407.firebaseapp.com",
  projectId: "restaurante-b3407",
  storageBucket: "restaurante-b3407.firebasestorage.app",
  messagingSenderId: "194092872715",
  appId: "1:194092872715:web:893635c0653d8d24a2030e",
  measurementId: "G-98DVP3XDNQ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);