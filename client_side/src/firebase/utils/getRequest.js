import { db } from '../config';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Memoization utility
const memoize = (fn) => {
  const cache = {};
  return async (...args) => {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    const result = await fn(...args);
    cache[key] = result;
    return result;
  };
};

// Fetch user details by email and role
const fetchUserDetailsByEmailAndRole = memoize(async (email, role) => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const q = query(usersCollectionRef, where('email', '==', email), where('role', '==', role));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userDetails = userDoc.data();
      console.log(userDetails);

      // Store user details in session storage
      sessionStorage.setItem('btech_user', JSON.stringify(userDetails));
      
      return userDetails;
    }

    throw new Error('User not found in the database');
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
});

// Fetch enquiries
const fetchEnquiries = memoize(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'enquiries'));
    const enquiries = [];
    querySnapshot.forEach((doc) => {
      enquiries.push({ ...doc.data(), id: doc.id }); // Include the unique document ID
    });
    return enquiries;
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    throw error;
  }
});

// Fetch all users
const fetchAndStoreUsers = memoize(async () => {
  try {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => doc.data());

    // Store the user list in session storage with key 'babtech_users'
    sessionStorage.setItem('btech_users', JSON.stringify(userList));

    return userList;
  } catch (error) {
    console.error('Error fetching and storing users:', error);
    throw error;
  }
});

// Fetch all courses and store in session storage
const fetchCourses = memoize(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'courses'));
    const courses = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id // Include the unique document ID
    }));

    // Store the courses in session storage with key 'babtech_courses'
    sessionStorage.setItem('btech_courses', JSON.stringify(courses));

    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
});

// Fetch timetables and store in session storage
const fetchTimetables = memoize(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'timetable'));
    const timetables = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id // Include the unique document ID
    }));

    // Store the timetables in session storage with key 'babtech_timetables'
    sessionStorage.setItem('btech_timetables', JSON.stringify(timetables));

    return timetables;
  } catch (error) {
    console.error('Error fetching timetables:', error);
    throw error;
  }
});

// Fetch timetables and store in session storage
const fetchPayments = memoize(async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'payments'));
    const payments = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id // Include the unique document ID
    }));
    console.log(payments);
    return payments;
  } catch (error) {
    console.error('Error fetching fetching payment:', error);
    throw error;
  }
});

export {
  fetchUserDetailsByEmailAndRole,
  fetchAndStoreUsers,
  fetchEnquiries,
  fetchCourses,
  fetchTimetables,
  fetchPayments
};
