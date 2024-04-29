import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDRLIc_UrPqjhV7W8KWaBdn10ZnCLv_wQU",
  authDomain: "task4-3bc94.firebaseapp.com",
  projectId: "task4-3bc94",
  storageBucket: "task4-3bc94.appspot.com",
  messagingSenderId: "30887295955",
  appId: "1:30887295955:web:d4ddfe2df645c825b3cd26"
};

const app = initializeApp(firebaseConfig);                         
const firestore = getFirestore(app);

export { app,firestore };