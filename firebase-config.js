// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTlmepfGQoEmeSrZBi7o-emgD7YOsflb0",
  authDomain: "todos-dc37b.firebaseapp.com",
  projectId: "todos-dc37b",
  storageBucket: "todos-dc37b.appspot.com",
  messagingSenderId: "952362700394",
  appId: "1:952362700394:web:40bc8f2a79e0fd35208413",
  measurementId: "G-33JT0EXWXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
