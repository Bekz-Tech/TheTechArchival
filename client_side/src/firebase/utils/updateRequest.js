import { db} from '../config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

//update users
const updateUserDetails = async (userId, userDetails) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, userDetails);
      console.log('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Function to update the 'read' status of an enquiry
  const updateEnquiryReadStatus = async (id) => {
    try {
      const enquiryRef = doc(db, 'enquiries', id); // Use unique document ID
  
      // Check if the document exists
      const docSnap = await getDoc(enquiryRef);
      if (!docSnap.exists()) {
        console.error(`No document found with ID: ${id}`);
        return;
      }
  
      // Update the read status
      await updateDoc(enquiryRef, { read: true });
      console.log(`Enquiry ${id} marked as read`);
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };


  export {updateUserDetails, updateEnquiryReadStatus}

