import { db, signOut, auth, createUserWithEmailAndPassword } from '../config';
import { doc,setDoc, collection} from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// Helper function to format date to a more readable format
const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
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
      sessionStorage.removeItem("btech_user");
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  export {logout, handleSignUp}