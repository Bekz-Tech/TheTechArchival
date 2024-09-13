import { db, signOut, auth, createUserWithEmailAndPassword } from '../config';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
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
    const studentsQuery = query(studentsCollectionRef, where('role', '==', 'student'));
    const querySnapshot = await getDocs(studentsQuery);

    let maxSerial = 0;
    querySnapshot.forEach((doc) => {
      const studentId = doc.data().userId;
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
      if (instructorId) {
        const serial = parseInt(instructorId.split('/').pop());
        if (serial > maxSerial) {
          maxSerial = serial;
        }
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
    const storedUsers = sessionStorage.getItem('btech_users');
    if (storedUsers) {
      const instructors = JSON.parse(storedUsers);
      return instructors.filter(instructor => instructor.programsAssigned.includes(program));
    }

    const instructorsCollectionRef = collection(db, 'users');
    const instructorsQuery = query(instructorsCollectionRef, where('role', '==', 'instructor'), where('programsAssigned', 'array-contains', program));
    const querySnapshot = await getDocs(instructorsQuery);

    const instructors = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      instructors.push({
        instructorId: data.instructorId,
        fullName: `${data.firstName} ${data.lastName}`,
        program: program,
        courses: data.courses
      });
    });

    sessionStorage.setItem('btech_users', JSON.stringify(instructors));
    return instructors;
  } catch (error) {
    console.error('Error fetching instructors:', error);
    throw error;
  }
};

// Handle sign up
const handleSignUp = async (formData, role, profilePicture, courses) => {
  console.log(courses);
  try {
    if (!formData.email || !formData.password) {
      throw new Error('Email and password are required');
    }

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
      const studentId = await generateStudentId(formData.programsAssigned);
      const existingAmount = 0;
      const amountPaid = parseInt(formData.amountPaid) + existingAmount;

      const program = formData.programsAssigned;
      const instructors = program ? await getInstructorsForProgram(program) : [];

      userDoc = {
        ...baseUserDoc,
        studentId,
        learningSchedules: [],
        instructors,
        studentProgress: 0,
        learningPlanClassesAndLessons: [],
        chatsWithInstructor: [],
        amountPaid,
        courses,
      };
    } else if (role === 'instructor') {
      const instructorId = await generateInstructorId();
      userDoc = {
        ...baseUserDoc,
        instructorId,
        programsAssigned: formData.programsAssigned || [],
        studentsAssigned: [],
        averageRating: 0,
        courses,
      };
      console.log(formData.courses);
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
            userDoc = { ...userDoc, profilePictureUrl: downloadURL };
            resolve();
          }
        );
      });
    }

    // Filter out undefined fields
    userDoc = Object.fromEntries(Object.entries(userDoc).filter(([_, v]) => v !== undefined));

    const usersCollectionRef = collection(db, 'users');
    await setDoc(doc(usersCollectionRef, user.uid), userDoc);

    console.log('User registered successfully');
    console.log(user.uid)
    return user.uid;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Logout logic
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
