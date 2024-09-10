
import { db } from '../config';
import { doc, deleteDoc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

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

const deleteTimetable = async (timetableId) => {
  console.log(timetableId);
  try {
    if (!timetableId) {
      throw new Error('Timetable ID is undefined or null. Cannot delete timetable.');
    }

    // Step 1: Delete the timetable entry from the `timetable` collection
    const timetableDocRef = doc(db, 'timetable', timetableId);
    const timetableDoc = await getDoc(timetableDocRef);

    if (!timetableDoc.exists()) {
      throw new Error('Timetable entry not found.');
    }

    // Delete the timetable from the `timetable` collection
    await deleteDoc(timetableDocRef);
    console.log('Timetable deleted successfully from timetable collection.');

    // Step 2: Find and remove the timetable from the instructor's `users.courses.timetable`
    // Query users collection to find instructors that have this timetable in their courses
    const usersCollectionRef = collection(db, 'users');
    const instructorsQuery = query(usersCollectionRef, where('role', '==', 'instructor'));
    const querySnapshot = await getDocs(instructorsQuery);

    const updatePromises = querySnapshot.docs.map(async (instructorDoc) => {
      const instructorData = instructorDoc.data();

      if (instructorData.courses && instructorData.courses.length > 0) {
        let timetableFound = false;

        // Create updated courses without mutating the original structure
        const updatedCourses = instructorData.courses.map((course) => {
          if (course.timetable && course.timetable.length > 0) {
            // Filter out the timetable entry that matches `timetableId`
            const updatedTimetableEntries = course.timetable.filter((entry) => entry.id !== timetableId);

            // If timetable with the `timetableId` was removed, mark it for updating
            if (updatedTimetableEntries.length !== course.timetable.length) {
              timetableFound = true;
            }
            return { ...course, timetable: updatedTimetableEntries }; // Return updated course
          }
          return course;
        });

        // If timetable was found and removed, update the instructor's document
        if (timetableFound) {
          const instructorDocRef = doc(db, 'users', instructorDoc.id);
          await updateDoc(instructorDocRef, { courses: updatedCourses });
          console.log(`Timetable deleted successfully from instructor's user document (ID: ${instructorDoc.id}).`);
        }
      }
    });

    // Wait for all promises to finish
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error deleting timetable:', error);
    throw error;
  }
};

export { deleteUser, deleteEnquiry, deleteTimetable };
