import { getAuth, deleteUser as deleteAuthUser } from "firebase/auth";
import { getFirestore, doc, updateDoc, deleteDoc} from "firebase/firestore";

const firestore = getFirestore();
const auth = getAuth();

const blockUser = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { status: 'blocked' });
  } catch (error) {
    throw new Error(`Error blocking user: ${error.message}`);
  }
};

const unblockUser = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { status: 'active' });
  } catch (error) {
    throw new Error(`Error unblocking user: ${error.message}`);
  }
};

const deleteUser = async (userId) => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await deleteDoc(userRef);

    const user = auth.currentUser;
    if (user && user.uid === userId) {
      await deleteAuthUser(user);
    } else {
      throw new Error("Cannot delete a user that is not currently signed in.");
    }
  } catch (error) {
    throw new Error(`Error deleting user: ${error.message}`);
  }
};


export { blockUser, unblockUser, deleteUser };