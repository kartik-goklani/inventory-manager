// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtAk6yN3j1gwLzUVg1o5l_GR1EMaIoSbo",
  authDomain: "inventory-manager-357c9.firebaseapp.com",
  projectId: "inventory-manager-357c9",
  storageBucket: "inventory-manager-357c9.appspot.com",
  messagingSenderId: "509502417706",
  appId: "1:509502417706:web:5182579a7ed458e8d38c53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}