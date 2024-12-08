import { collection, onSnapshot, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config';

// Function to listen for changes in instructors
const listenForInstructorChanges = () => {
  const instructorQuery = query(collection(db, 'users'), where('role', '==', 'instructor'));

  // Set up the listener
  onSnapshot(instructorQuery, async (querySnapshot) => {
    querySnapshot.docChanges().forEach(async (change) => {
      const instructorData = change.doc.data();

      if (change.type === 'modified') {
        console.log('Instructor updated:', instructorData);

        // Find students who are assigned to this instructor
        await updateStudentsWithInstructor(instructorData);
      }
    });
  });
};

// Function to update students who have the given instructor assigned
const updateStudentsWithInstructor = async (instructorData) => {
  // Query to find students with the matching instructorId in their assignedInstructor field
  const studentQuery = query(
    collection(db, 'users'),
    where('role', '==', 'student'),
    where('assignedInstructor.instructorId', '==', instructorData.instructorId) // Correct query for object field
  );

  const querySnapshot = await getDocs(studentQuery);

  querySnapshot.forEach(async (studentDoc) => {
    const studentData = studentDoc.data();

    // Completely replace the assignedInstructor object with the entire instructorData
    await updateDoc(doc(db, 'users', studentDoc.id), {
      assignedInstructor: instructorData,
    });

    console.log(`Student ${studentData.firstName} ${studentData.lastName} updated with new instructor details.`);
  });
};

export { listenForInstructorChanges };
