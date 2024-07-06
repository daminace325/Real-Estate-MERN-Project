// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-cf996.firebaseapp.com",
  projectId: "mern-estate-cf996",
  storageBucket: "mern-estate-cf996.appspot.com",
  messagingSenderId: "570709462780",
  appId: "1:570709462780:web:3850aceff75a8156771179"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);