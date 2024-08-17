import { db } from '../config';
import { doc, addDoc, setDoc, collection, query, where, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';

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

    // Enrich course data
    const enrichedCourseData = {
      courseId,
      ...courseData,
      createdAt: formatDate(new Date()),
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
        curriculum: [], // Initialize with an empty curriculum
        duration: courseData.duration, // Include the course duration
        assignedStudents: [], // Add students as needed
        assignments: [],
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

export { submitEnquiry, addUser, addCourse };
