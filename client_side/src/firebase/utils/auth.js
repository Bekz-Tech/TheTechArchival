import { db, signOut, auth, createUserWithEmailAndPassword } from '../config';
import { doc, setDoc, collection, query, where, getDocs, onSnapshot,orderBy, limit  } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Helper function to format date to a more readable format
const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${hours}:${minutes}:${seconds}`;
}

// Function to get instructors for a program
const getInstructorsForProgram = async (program) => {
  try {
    const storedUsers = sessionStorage.getItem("btech_users");
    if (storedUsers) {
      const instructors = JSON.parse(storedUsers);
      // Check if programsAssigned exists before calling includes
      return instructors.filter(
        (instructor) =>
          instructor.programsAssigned &&
          instructor.programsAssigned.includes(program)
      );
    }

    const instructorsCollectionRef = collection(db, "users");
    const instructorsQuery = query(
      instructorsCollectionRef,
      where("role", "==", "instructor"),
      where("programsAssigned", "array-contains", program)
    );
    const querySnapshot = await getDocs(instructorsQuery);

    const instructors = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      instructors.push({
        instructorId: data.instructorId,
        fullName: `${data.firstName} ${data.lastName}`,
        program: program,
        courses: data.courses,
      });
    });

    sessionStorage.setItem("btech_users", JSON.stringify(instructors));
    return instructors;
  } catch (error) {
    console.error("Error fetching instructors:", error);
    throw error;
  }
};


//save student in mongodb
const createStudent = async (
  userId,
  email,
  passwordHash,
  role,
  firstName,
  lastName,
  idCardUrl,
  studentId,
  amountPaid,
  program,
  instructors,
  profilePictureUrl
) => {
  const url = import.meta.env.VITE_FIREBASE_MONGO_STUDENTS; // Make sure this URL is correct

  // Fetch instructors for the given program
  const newInstructors = await getInstructorsForProgram(program);
  const newStudent = {
    userId,
    email,
    passwordHash,
    role,
    firstName,
    lastName,
    idCardUrl,
    studentId,
    amountPaid,
    program,
    newInstructors,
    profilePictureUrl,
  };

  console.log(newStudent); // Log the new student object for debugging

  try {
    const response = await fetch("http://localhost:8000/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudent), // Stringify the object
    });

    if (!response.ok) {
      throw new Error("Something went wrong posting data");
    }

    const data = await response.json(); // Parse the response JSON if needed
    console.log("Student created successfully:", data); // Log the response
  } catch (error) {
    console.error("Error creating student:", error);
  }
};

// Function to generate a student ID
const generateStudentId = async (program, offline) => {
  const studentCollection = offline ? "offlineStudents" : "users";
  const studentsCollectionRef = collection(db, studentCollection);

  try {
    // Query to get the most recent registered student by updatedAt and time
    const lastStudentQuery = query(
      studentsCollectionRef,
      where('role', '==', 'student'),
      orderBy("time", "desc"),
      orderBy("updatedAt", "desc"), // Secondary sort by date
      limit(1)
    );

    const lastStudentSnapshot = await getDocs(lastStudentQuery);

    if (lastStudentSnapshot.empty) {
      // Return the default ID if no existing student is found
      console.log('Query returned empty, returning default ID');
      return `btech/std/${program}/112`;
    }

    // Extract last student ID and increment the serial number
    const lastStudentId = lastStudentSnapshot.docs[0].data().studentId;
    const idParts = lastStudentId.split("/");
    const lastSerial = parseInt(idParts[idParts.length - 1], 10);
    const newSerial = lastSerial + 1;

    // Generate new student ID with incremented serial only
    const newStudentId = `btech/std/${program}/${newSerial.toString().padStart(2, "0")}`;
    return newStudentId;

  } catch (error) {
    console.error("Error generating unique student ID:", error);
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



// Handle sign up
const handleSignUp = async (formData, role, profilePicture, courses, idCardUrl, offline) => {
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
      idCardUrl,
      createdAt: formatDate(new Date()),
      updatedAt: formatDate(new Date()),
      messages: [],
      time: getCurrentTime()
    };

    let userDoc = { ...baseUserDoc };

    if (role === 'student') {

      if (offline) {

         const program = formData.programsAssigned;
         const instructors = program
           ? await getInstructorsForProgram(program)
          : [];
        
        const studentId = await generateStudentId(formData.program);
        
          userDoc = {
            ...baseUserDoc,
            studentId,
            courses,
        };
        
        createStudent(
          user.uid,
          formData.email,
          formData.password,
          role,
          formData.firstName,
          formData.lastName,
          idCardUrl,
          studentId,
          formData.amountPaid,
          formData.program,
          instructors,
          profilePicture
        );

      } else {
        const studentId = await generateStudentId(formData.program);
        const existingAmount = 0;
        const amountPaid = parseInt(formData.amountPaid) + existingAmount;

        const program = formData.programsAssigned;
        const instructors = program
          ? await getInstructorsForProgram(program)
          : [];

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

        // Send payment details to payment collection
        const paymentCollectionRef = collection(db, "payments");
        await setDoc(doc(paymentCollectionRef, user.uid), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          createdAt: formatDate(new Date()),
          amountPaid,
          userId: user.uid,
          // courseName: program
        });
      }

  
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

    const studentCollection = offline && role === 'student' ? 'offlineStuents' : 'users';

    const usersCollectionRef = collection(db, studentCollection);
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

export { logout, handleSignUp, generateStudentId };
