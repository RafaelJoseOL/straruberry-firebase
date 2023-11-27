import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvC1e_UchNK9qog8MwJYogH7dINBYpi1k",
  authDomain: "strarudb.firebaseapp.com",
  projectId: "strarudb",
  storageBucket: "strarudb.appspot.com",
  messagingSenderId: "409231484836",
  appId: "1:409231484836:web:14fe514ca3e79aca4fc331",
  measurementId: "G-S5T83TXW39"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Configuración de Firebase Authentication
export const auth = getAuth(app);

// Configuración de Firestore
export const db = getFirestore(app);
