
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCwnqrSpOlnclzvmDVHvQiGTvjUWhY8YV8",
//   authDomain: "registration-5ce30.firebaseapp.com",
//   projectId: "registration-5ce30",
//   storageBucket: "registration-5ce30.appspot.com",
//   messagingSenderId: "291529977923",
//   appId: "1:291529977923:web:bed8381158561c0a0ce4f6",
//   measurementId: "G-R7LLJXM04X"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCSTTYJxfiM3e7hIJyV1qLw4TIaGoFRpmk",
  authDomain: "rough-a2a23.firebaseapp.com",
  projectId: "rough-a2a23",
  storageBucket: "rough-a2a23.appspot.com",
  messagingSenderId: "244770820392",
  appId: "1:244770820392:web:2cfd2556c28152b0db001d"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;
export { app };