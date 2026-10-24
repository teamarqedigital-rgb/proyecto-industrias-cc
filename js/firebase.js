import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCdg3Y1TpceV5kJna1yV1nBmG4DhLrvjiM",
  authDomain: "industriascc-ef4c3.firebaseapp.com",
  projectId: "industriascc-ef4c3",
  storageBucket: "industriascc-ef4c3.firebasestorage.app",
  messagingSenderId: "204930574643",
  appId: "1:204930574643:web:1700d6913f2a323b12b646"
};

export const db = getFirestore(initializeApp(firebaseConfig));