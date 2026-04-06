import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKDs-bglSolXuuE-9OKrrSJWwSTA6U52s",
  authDomain: "devops-monitor-a60d8.firebaseapp.com",
  projectId: "devops-monitor-a60d8",
  storageBucket: "devops-monitor-a60d8.firebasestorage.app",
  messagingSenderId: "627708600227",
  appId: "1:627708600227:web:a3dbd3d90d6d61cf410416"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
