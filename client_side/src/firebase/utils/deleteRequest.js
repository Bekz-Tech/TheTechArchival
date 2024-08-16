import { db} from '../config';
import { doc, deleteDoc} from 'firebase/firestore';
// import admin from '../adminConfig'; // Make sure the path to adminConfig.js is correct

// Delete user from Firestore and Firebase Authentication
const deleteUser = async (userId) => {
  try {
    // Delete user from Firestore
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('User deleted from Firestore successfully');

    // Delete user from Firebase Authentication
    await admin.auth().deleteUser(userId);
    console.log('User deleted from Firebase Authentication successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

  const deleteEnquiry = async (id) => {
    try {
      const enquiryRef = doc(db, 'enquiries', id);
      await deleteDoc(enquiryRef);
      console.log(`Enquiry ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      throw error;
    }
  };

  export {deleteUser, deleteEnquiry}