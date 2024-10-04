import { db} from '../config';
import { doc, updateDoc, collection, query, where, getDocs, arrayUnion, getDoc } from 'firebase/firestore';
import { fetchUserDetailsByEmailAndRole, fetchAndStoreUsers } from './getRequest';
import { generateStudentId } from './auth'


const updateUserDetails = async (userId, userDetails) => {
  console.log(userId)
  try {
    if (!userId || typeof userId !== 'string') {
      throw new Error("Invalid User ID");
    }

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error("User not found");
      return;
    }

    const currentUserData = userSnap.data();

    // Check if the program has changed
    if (userDetails.program !== currentUserData.program) {

      // Update the courses field by fetching courses for the new program
      const coursesCollectionRef = collection(db, 'courses');
      const coursesQuery = query(coursesCollectionRef, where('courseName', '==', userDetails.program));
      const coursesSnapshot = await getDocs(coursesQuery);

      if (!coursesSnapshot.empty) {
        const courseData = coursesSnapshot.docs.map(doc => doc.data());
        userDetails.courses = courseData; // Assuming the courses are stored as an array in the student document
        console.log(courseData);
      }

      // Generate a new studentId for the new program
      const newStudentId = await generateStudentId(userDetails.program);
      userDetails.studentId = newStudentId;
    }

    // Check if userDetails contains a selectedInstructor to reassign
    if (userDetails.assignedInstructor) {
      const selectedInstructorId = userDetails.assignedInstructor;

      // Fetch full instructor details from Firestore
      const instructorRef = doc(db, 'users', selectedInstructorId); 
      const instructorSnap = await getDoc(instructorRef);

      if (instructorSnap.exists()) {
        const instructorData = instructorSnap.data();
        // Update userDetails to include full instructor details
        userDetails.assignedInstructor = {
          instructorId: selectedInstructorId,
          ...instructorData
        };
      } else {
        console.error("Instructor not found");
        return;
      }
    }

    // Update the student document in Firestore
    await updateDoc(userRef, userDetails);
    await fetchAndStoreUsers();

    console.log("User details updated successfully");
  } catch (error) {
    console.error('Error updating user details:', error);
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


// Function to update an assignment
const updateAssignment = async (assignmentId, updatedAssignment, email, role) => {

  try {
    // Step 1: Update the assignment in the `assignments` collection
    const assignmentDocRef = doc(db, 'assignments', assignmentId);
    await updateDoc(assignmentDocRef, updatedAssignment);
    console.log('Assignment updated successfully in the assignments collection.');
    console.log(updateAssignment)

    // Step 2: Update the assignment in the instructor's document
    const usersCollectionRef = collection(db, 'users');
    const instructorsQuery = query(
      usersCollectionRef,
      where('role', '==', 'instructor'),
      where('userId', '==', updatedAssignment.createdBy)
    );
    const querySnapshot = await getDocs(instructorsQuery);

    querySnapshot.forEach(async (instructorDoc) => {
      const instructorDocRef = doc(db, 'users', instructorDoc.id);
      const instructorData = instructorDoc.data();

      if (instructorData.courses) {
        // Find the specific course that contains the assignment
        const updatedCourses = instructorData.courses.map((course) => {
          if (course.courseId === updatedAssignment.courseId) {
            // Update only the assignments in the specific course
            const updatedAssignments = course.assignments.map((assignment) =>
              assignment.id === assignmentId ? { ...assignment, ...updatedAssignment } : assignment
            );
            return { ...course, assignments: updatedAssignments };
          }
          return course; // Return unchanged course
        });

        // Update the instructor's document with the modified courses
        await updateDoc(instructorDocRef, { courses: updatedCourses });
        console.log(`Assignment updated successfully in instructor's user document (ID: ${instructorDoc.id}).`);
      }
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }

  fetchUserDetailsByEmailAndRole(email, role);
};





  export {
    updateUserDetails,
    updateEnquiryReadStatus,
    updateCourseCurriculum,
    updateTimetable,
    updateAssignment,
    generateStudentId
  }

