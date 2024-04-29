import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore"; 
import { app } from './firebase';

const auth = getAuth(app);
const firestore = getFirestore(app);

const registerWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = doc(firestore, 'users', user.uid);
    await setDoc(userDoc, { name: name, email: user.email, registrationTime: Date.now(), lastLoginTime: Date.now() });
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('This email address is already in use.');
    } else {
      console.error('Error registering user:', error);
      throw error;
    }
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(firestore, 'users', user.uid));
    const userData = userDoc.data();

    if (!userData) {
      await signOut(auth);
      throw new Error('This account does not exist.');
    }

    if (userData.status === 'blocked') {
      await signOut(auth);
      throw new Error('This account has been blocked.');
    }

    // Update the last login time in Firestore
    const userRef = doc(firestore, 'users', user.uid);
    await setDoc(userRef, { lastLoginTime: Date.now() }, { merge: true });

    return userCredential;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

const logout = () => {
  return signOut(auth);
};

export { registerWithEmailAndPassword, loginWithEmailAndPassword, logout};
export { auth };