import { db, signOut, auth, createUserWithEmailAndPassword } from '../config';
import { doc, setDoc, collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Helper function to format date to a more readable format
const formatDate = (date) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Existing functions
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

const fetchUserDetailsByEmailAndRole = async (email, role) => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email), where('role', '==', role));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      console.log(userDoc.data());
      return userDoc.data();
    }

    throw new Error('User not found in the database');
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
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
      // Update userDoc to include amountPaid
      const existingAmount = 0; // Replace with logic to fetch existing amount from database
      const amountPaid = parseInt(formData.amountPaid) + existingAmount;

      userDoc = {
        ...baseUserDoc,
        learningSchedules: [],
        instructors: [],
        assignments: [],
        studentProgress: 0,
        learningPlanClassesAndLessons: [],
        chatsWithInstructor: [],
        amountPaid: amountPaid, // Include amountPaid in userDoc
      };
    } else if (role === 'instructor') {
      userDoc = {
        ...baseUserDoc,
        coursesTaught: 0,
        studentsTaught: 0,
        averageRating: 0,
        createdAt: formatDate(new Date()),
        updatedAt: formatDate(new Date()),
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
            // Progress function if needed
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
    localStorage.removeItem("btech_user");
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};



const fetchAndStoreUsers = async () => {
  const usersCollection = collection(db, 'users');
  const userSnapshot = await getDocs(usersCollection);
  const userList = userSnapshot.docs.map(doc => doc.data());

  // Store the users in session storage as 'btech_users'
  sessionStorage.setItem('btech_users', JSON.stringify(userList));

  return userList;
};


const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const updateUserDetails = async (userId, userDetails) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userDetails);
    console.log('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const submitEnquiry = async (enquiryData) => {
  try {
    const response = await someFirebaseFunction(enquiryData);
    console.log('Enquiry submitted successfully:', response);
    return response;
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    throw error;
  }
};

export {
  handleSignUp,
  addUser,
  logout,
  fetchUserDetailsByEmailAndRole,
  fetchAndStoreUsers,
  deleteUser,
  updateUserDetails,
  submitEnquiry
};
