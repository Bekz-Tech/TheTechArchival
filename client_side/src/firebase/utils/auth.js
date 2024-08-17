import { db, signOut, auth, createUserWithEmailAndPassword } from '../config';
import { doc, setDoc, collection, updateDoc, arrayUnion, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Helper function to format date to a more readable format
const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Function to generate a student ID
const generateStudentId = async (program) => {
  try {
    const studentsCollectionRef = collection(db, 'users');
    const studentsQuery = query(studentsCollectionRef, where('role', '==', 'student'), where('program', '==', program));
    const querySnapshot = await getDocs(studentsQuery);
    
    let maxSerial = 0;
    querySnapshot.forEach((doc) => {
      const studentId = doc.data().studentId;
      const serial = parseInt(studentId.split('/').pop());
      if (serial > maxSerial) {
        maxSerial = serial;
      }
    });

    const newSerial = (maxSerial + 1).toString().padStart(2, '0');
    return `btech/std/${program}/${newSerial}`;
  } catch (error) {
    console.error('Error generating student ID:', error);
    throw error;
  }
};

// Function to generate an instructor ID
const generateInstructorId = async () => {
  try {
    const instructorsCollectionRef = collection(db, 'users');
    const instructorsQuery = query(instructorsCollectionRef, where('role', '==', 'instructor'));
    const querySnapshot = await getDocs(instructorsQuery);

    let maxSerial = 0;
    querySnapshot.forEach((doc) => {
      const instructorId = doc.data().instructorId;
      const serial = parseInt(instructorId.split('/').pop());
      if (serial > maxSerial) {
        maxSerial = serial;
      }
    });

    const newSerial = (maxSerial + 1).toString().padStart(2, '0');
    return `btech/inst/${newSerial}`;
  } catch (error) {
    console.error('Error generating instructor ID:', error);
    throw error;
  }
};

// Function to get instructors for a program
const getInstructorsForProgram = async (program) => {
  try {
    const instructorsCollectionRef = collection(db, 'users');
    const instructorsQuery = query(instructorsCollectionRef, where('role', '==', 'instructor'), where('programsAssigned', 'array-contains', program));
    const querySnapshot = await getDocs(instructorsQuery);

    const instructors = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      instructors.push({
        instructorId: data.instructorId,
        fullName: `${data.firstName} ${data.lastName}`, // Adjust if you have different fields
        program: program
      });
    });
    return instructors;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

// Sign up logic
const handleSignUp = async (formData, role, profilePicture) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const user = userCredential.user;

    const baseUserDoc = {
      userId: user.uid,
      ...formData,
      role,
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
    };

    let userDoc = { ...baseUserDoc };

    if (role === 'student') {
      const studentId = await generateStudentId(formData.program); // Generate student ID
      const existingAmount = 0; // Replace with logic to fetch existing amount from database
      const amountPaid = parseInt(formData.amountPaid) + existingAmount;
      
      // Get instructors for the program
      const instructors = await getInstructorsForProgram(formData.program);

      userDoc = {
        ...baseUserDoc,
        studentId, // Add studentId
        learningSchedules: [],
        instructors, // Add instructors array with relevant info
        studentProgress: 0,
        learningPlanClassesAndLessons: [],
        chatsWithInstructor: [],
        amountPaid, // Include amountPaid in userDoc
      };
    } else if (role === 'instructor') {
      const instructorId = await generateInstructorId(); // Generate instructor ID
      userDoc = {
        ...baseUserDoc,
        instructorId, // Add instructorId
        programsAssigned: formData.programsAssigned || [], // Programs the instructor is assigned to
        studentsAssigned: [], // Array of students assigned to the instructor
        coursesTaught: 0,
        studentsTaught: 0,
        averageRating: 0,
      };
    }

    if (profilePicture) {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${profilePicture.name}`);
      const uploadTask = uploadBytesResumable(storageRef, profilePicture);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            console.log(`Upload is ${snapshot.bytesTransferred / snapshot.totalBytes * 100}% done`);
          },
          (error) => {
            console.error('Upload failed:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            userDoc = { ...userDoc, profilePictureUrl: downloadURL };
            resolve();
          }
        );
      });
    }

    const usersCollectionRef = collection(db, 'users');
    await setDoc(doc(usersCollectionRef, user.uid), userDoc);

    // If role is instructor, update existing instructors with new student if necessary
    if (role === 'instructor') {
      const instructorsQuery = query(usersCollectionRef, where('role', '==', 'instructor'));
      const querySnapshot = await getDocs(instructorsQuery);

      querySnapshot.forEach(async (instructorDoc) => {
        const instructorDocRef = doc(db, 'users', instructorDoc.id);
        await updateDoc(instructorDocRef, {
          studentsAssigned: arrayUnion(user.uid)
        });
      });
    }

    console.log('User registered successfully');
    return true;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Login logic
const logout = async () => {
  try {
    sessionStorage.removeItem("btech_user");
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export { logout, handleSignUp };
