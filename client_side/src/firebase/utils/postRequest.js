import { db } from '../config';
import { doc, addDoc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

// Function to generate a course ID using "e-learning" initials and course name initials
const generateCourseId = (courseName) => {
  const eLearningInitials = 'EL';
  const courseInitials = courseName.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
  const randomString = Math.random().toString(36).substr(2, 2).toUpperCase();
  return `${eLearningInitials}${courseInitials}${randomString}`.substr(0, 6);
};

// Function to format dates
const formatDate = (date) => {
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};
// Function to add a course to Firestore
const addCourse = async (courseData) => {
  try {
    const courseId = generateCourseId(courseData.courseName);

    // Enrich course data with cost and other details
    const enrichedCourseData = {
      courseId,
      ...courseData,
      createdAt: formatDate(new Date()),
      cost: `₦ ${courseData.cost}` || 0, // Add cost field with default value if not provided
      assignments: [] // Add default empty curriculum

    };

    // Add the course to the Firestore collection
    const courseRef = await addDoc(collection(db, 'courses'), enrichedCourseData);
    console.log('Course added successfully:', courseRef.id);

    // Fetch all instructors
    const usersCollectionRef = collection(db, 'users');
    const instructorsQuery = query(usersCollectionRef, where('role', '==', 'instructor'));
    const querySnapshot = await getDocs(instructorsQuery);

    querySnapshot.forEach(async (instructorDoc) => {
      // Create a course instance for instructors with curriculum marked as incomplete
      const courseInstance = {
        courseId: courseRef.id,
        courseName: courseRef.courseName,
        curriculum: [], // Initialize with an empty curriculum
        duration: courseData.duration, // Include the course duration
        assignedStudents: [], // Add students as needed
        assignments: [],
        cost: courseData.cost || 0, // Include the cost field in the instructor's course instance
      };

      // Update each instructor's document by adding the course instance
      const instructorDocRef = doc(db, 'users', instructorDoc.id);
      await updateDoc(instructorDocRef, {
        courses: arrayUnion(courseInstance),
      });
    });

    alert('Course added and assigned to all instructors successfully');
    return courseRef.id;
  } catch (error) {
    console.error('Error adding course and assigning to instructors:', error);
    throw error;
  }
};

// Function to submit an enquiry
const submitEnquiry = async (enquiryData) => {
  try {
    const uniqueId = generateCourseId('Enquiry');
    const formattedDate = formatDate(new Date());
    const enrichedEnquiryData = {
      ...enquiryData,
      id: uniqueId,
      createdAt: formattedDate,
      read: false,
    };

    const docRef = await addDoc(collection(db, 'enquiries'), enrichedEnquiryData);
    console.log('Enquiry submitted successfully:', docRef.id);
    alert("Thank you for reaching out to us, we will get back to you as soon as possible");
    return docRef.id;
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
};

// Function to add a user to Firestore
const addUser = async (user) => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', user.email), where('role', '==', user.role));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      alert(`A user with email ${user.email} already exists as ${user.role}`);
      return;
    }

    const userRef = doc(usersCollectionRef, user.userId);
    await setDoc(userRef, user);
    console.log('User added successfully');
  } catch (error) {
    console.error('Error adding user: ', error);
  }
};


//post assignment by instructor
const addAssignmentToInstructors = async (assignment) => {
  try {
    // Fetch the course from the courses collection
    const coursesCollectionRef = collection(db, 'users');
    const courseQuery = query(coursesCollectionRef, where('courseId', '==', assignment.courseId));
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
      throw new Error(`Course with ID ${assignment.courseId} not found.`);
    }

    // Assume one course is returned
    const courseDoc = courseSnapshot.docs[0];
    const courseData = courseDoc.data();

    // Now query all instructors teaching this course
    const usersCollectionRef = collection(db, 'users');
    const instructorsQuery = query(usersCollectionRef, where('role', '==', 'instructor'));
    const instructorsSnapshot = await getDocs(instructorsQuery);

    instructorsSnapshot.forEach(async (instructorDoc) => {
      const instructorData = instructorDoc.data();

      // Iterate over the instructor's courses to find the matching course
      const updatedCourses = instructorData.courses.map(course => {
        if (course.courseId === courseData.courseId) {
          // Push the new assignment to the course's assignments array
          return {
            ...course,
            assignments: arrayUnion({
              title: assignment.title,
              dueDate: assignment.dueDate,
              description: assignment.description,
              courseName: courseData.courseName, // Add courseName from the courses collection
            }),
          };
        }
        return course;
      });

      // Update the instructor's document with the new assignment
      const instructorDocRef = doc(db, 'users', instructorDoc.id);
      await updateDoc(instructorDocRef, { courses: updatedCourses });
    });

    console.log('Assignment added to instructors successfully');
  } catch (error) {
    console.error('Error adding assignment to instructors: ', error);
    throw error;
  }
};

// Function to add a timetable to the courses field for instructors
const addTimetableToInstructors = async (timetable, userId, courseId) => {
  try {
    if (!userId || !courseId) {
      throw new Error('User ID or Course ID is undefined or null. Cannot update timetable.');
    }

    // Step 1: Reference the instructor's document in Firestore by user ID
    const instructorDocRef = doc(db, 'users', userId);
    const instructorDoc = await getDoc(instructorDocRef);

    if (!instructorDoc.exists()) {
      throw new Error('Instructor not found.');
    }

    const instructorData = instructorDoc.data();
    const { firstName, lastName } = instructorData; // Extract firstName and lastName

    if (instructorData.courses && instructorData.courses.length > 0) {
      const course = instructorData.courses.find(course => course.id === courseId);

      if (!course) {
        throw new Error('Course not found.');
      }

      const { courseName } = course; // Extract course name

      // Step 2: Add the timetable to the 'timetable' collection and get the generated ID
      const timetableEntry = {
        userId,
        firstName,
        lastName,
        courseId,
        courseName,
        date: timetable.date,
        time: timetable.time,
        location: timetable.location,
        topic: timetable.topic,
        done: false,
      };

      const timetableCollectionRef = collection(db, 'timetable');
      const timetableDocRef = await addDoc(timetableCollectionRef, timetableEntry);
      const timetableId = timetableDocRef.id; // Get the generated timetable ID

      console.log(`Timetable entry saved successfully with ID: ${timetableId}`);

      // Step 3: Add the timetable ID to the course's timetable array in the instructor document
      const updatedCourses = instructorData.courses.map(course => {
        if (course.id === courseId) {
          if (!course.timetable) {
            course.timetable = []; // Initialize timetable array if it doesn't exist
          }
          // Add new timetable entry with the timetable ID
          course.timetable.push({
            id: timetableId,
            date: timetable.date,
            time: timetable.time,
            location: timetable.location,
            topic: timetable.topic,
            done: false,
          });
        }
        return course; // Return the updated course
      });

      // Step 4: Update the instructor document with the new timetable entry
      await updateDoc(instructorDocRef, { courses: updatedCourses });

      console.log('Timetable added or updated successfully in user document.');
    } else {
      console.log('No courses found for the instructor.');
    }
  } catch (error) {
    console.error('Error adding timetable to instructors: ', error);
    throw error;
  }
};





export { submitEnquiry,
  addUser,
  addCourse,
  addAssignmentToInstructors,
  addTimetableToInstructors
};
