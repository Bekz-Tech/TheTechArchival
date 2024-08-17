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

  // Function to update the curriculum for an existing course
const updateCourseCurriculum = async (courseId, newCurriculum) => {
  try {
    // Fetch the course document
    const courseDocRef = doc(db, 'courses', courseId);
    
    // Update the course document with the new curriculum
    await updateDoc(courseDocRef, {
      curriculum: newCurriculum
    });

    // Update each instructor's course instance with the new curriculum
    const usersCollectionRef = collection(db, 'users');
    const instructorsQuery = query(usersCollectionRef, where('role', '==', 'instructor'));
    const querySnapshot = await getDocs(instructorsQuery);

    querySnapshot.forEach(async (instructorDoc) => {
      const instructorDocRef = doc(db, 'users', instructorDoc.id);

      // Update the curriculum in the instructor's course instance
      await updateDoc(instructorDocRef, {
        'courses': arrayUnion({
          courseId,
          curriculum: newCurriculum
        })
      });
    });

    alert('Course curriculum updated successfully');
  } catch (error) {
    console.error('Error updating course curriculum:', error);
    throw error;
  }
};



  export {
    updateUserDetails,
    updateEnquiryReadStatus,
    updateCourseCurriculum
  }

