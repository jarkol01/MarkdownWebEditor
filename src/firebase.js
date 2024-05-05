import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCexgXmp7cL5LUDPvNAXq0DBUYuB6KYTE4",
  authDomain: "markdownwebeditor.firebaseapp.com",
  projectId: "markdownwebeditor",
  storageBucket: "markdownwebeditor.appspot.com",
  messagingSenderId: "742363472397",
  appId: "1:742363472397:web:025d3bc384e4d7806beb44"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth =  getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
