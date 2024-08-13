
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_AMe5dPGXftQGnKF6-XCsjw2bUNp67cQ",
  authDomain: "cinescope-23ca2.firebaseapp.com",
  projectId: "cinescope-23ca2",
  storageBucket: "cinescope-23ca2.appspot.com",
  messagingSenderId: "1009927750693",
  appId: "1:1009927750693:web:d37018096864f6da876bcc"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);

export const db=getFirestore(app);