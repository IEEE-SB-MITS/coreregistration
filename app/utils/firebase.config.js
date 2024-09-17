// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { defaultConfig } from "next/dist/server/config-shared";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0UTmzR1DEm-LnkAY4u643mKOe7RbirfE",
  authDomain: "registrationform-34a05.firebaseapp.com",
  databaseURL: "https://registrationform-34a05-default-rtdb.firebaseio.com",
  projectId: "registrationform-34a05",
  storageBucket: "registrationform-34a05.appspot.com",
  messagingSenderId: "59655148348",
  appId: "1:59655148348:web:42935fc916c9f9da8b4439",
  measurementId: "G-PBW1077KCS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;