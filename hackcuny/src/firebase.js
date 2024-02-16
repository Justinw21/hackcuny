// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2BcaafvVRQxVoO666Lvuo-Fyk5Q87s14",
  authDomain: "practice-89cd8.firebaseapp.com",
  projectId: "practice-89cd8",
  storageBucket: "practice-89cd8.appspot.com",
  messagingSenderId: "654144397594",
  appId: "1:654144397594:web:cbedbbdb38912679868ca3",
  measurementId: "G-W0R2J7X222"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export {auth}

//const analytics = getAnalytics(app);