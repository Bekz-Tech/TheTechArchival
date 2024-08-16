import { db} from '../config';
import { doc, addDoc, setDoc, collection, query, where, getDocs} from 'firebase/firestore';

const generateUniqueId = () => {
  return 'xxxxxxxxyxxx4xxxxyxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
          v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const formatDate = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const submitEnquiry = async (enquiryData) => {
    try {
      // Generate a unique ID for the enquiry
      const uniqueId = generateUniqueId();
  
      // Add createdAt and read fields
      const formattedDate = formatDate(new Date()); // Format current date
      const enrichedEnquiryData = {
        ...enquiryData,
        id: uniqueId, // Add unique ID field
        createdAt: formattedDate,
        read: false, // Add read field and set it to false
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

  export {submitEnquiry, addUser}