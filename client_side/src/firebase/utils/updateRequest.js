import { db} from '../config';
import { doc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';

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


//updating timetable logic
const updateTimetable = async (timetableId, updatedTimetable) => {
  try {
    if (!timetableId) {
      throw new Error('Timetable ID is undefined or null. Cannot update timetable.');
    }

    // Step 1: Update the timetable entry in the `timetable` collection
    const timetableDocRef = doc(db, 'timetable', timetableId);
    const timetableDoc = await getDoc(timetableDocRef);

    if (!timetableDoc.exists()) {
      throw new Error('Timetable entry not found.');
    }

    // Update the timetable in the `timetable` collection
    await updateDoc(timetableDocRef, {
      date: updatedTimetable.date,
      time: updatedTimetable.time,
      location: updatedTimetable.location,
      topic: updatedTimetable.topic,
      done: updatedTimetable.done ?? false,
    });

    console.log('Timetable updated successfully in timetable collection.');

    // Step 2: Find the timetable in the instructor's `users.courses.timetable` and update it
    // Query users collection to find the instructor that has this timetable in their courses
    const usersCollectionRef = collection(db, 'users');
    const instructorsQuery = query(usersCollectionRef, where('role', '==', 'instructor'));
    const querySnapshot = await getDocs(instructorsQuery);

    querySnapshot.forEach(async (instructorDoc) => {
      const instructorData = instructorDoc.data();

      if (instructorData.courses && instructorData.courses.length > 0) {
        let timetableFound = false;

        // Loop through each course of the instructor
        const updatedCourses = instructorData.courses.map((course) => {
          if (course.timetable && course.timetable.length > 0) {
            // Update the timetable with matching `timetableId`
            const updatedTimetableEntries = course.timetable.map((entry) => {
              if (entry.id === timetableId) {
                timetableFound = true;
                return {
                  ...entry,
                  date: updatedTimetable.date,
                  time: updatedTimetable.time,
                  location: updatedTimetable.location,
                  topic: updatedTimetable.topic,
                  done: updatedTimetable.done ?? false,
                };
              }
              return entry; // Return unchanged timetable entry
            });
            course.timetable = updatedTimetableEntries; // Assign updated timetable
          }
          return course; // Return updated course
        });

        // If timetable was found, update the instructor's document
        if (timetableFound) {
          const instructorDocRef = doc(db, 'users', instructorDoc.id);
          await updateDoc(instructorDocRef, { courses: updatedCourses });
          console.log(`Timetable updated successfully in instructor's user document (ID: ${instructorDoc.id}).`);
        }
      }
    });
  } catch (error) {
    console.error('Error updating timetable:', error);
    throw error;
  }
};



  export {
    updateUserDetails,
    updateEnquiryReadStatus,
    updateCourseCurriculum,
    updateTimetable
  }

