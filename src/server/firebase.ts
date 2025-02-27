// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database"
import { env } from "~/env";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_APIKEY,
  authDomain: env.NEXT_PUBLIC_AUTHDOMAIN,
  databaseURL: env.NEXT_PUBLIC_DATABASEURL,
  projectId: env.NEXT_PUBLIC_PROJECTID,
  storageBucket: env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: env.NEXT_PUBLIC_APPID,
  measurementId: env.NEXT_PUBLIC_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const analytics = getAnalytics(app);

export { app, database, analytics }
