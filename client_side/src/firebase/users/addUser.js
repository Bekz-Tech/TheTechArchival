import { addUser } from '../FirebaseConstanst';
import {
  adminUser,
  studentUser,
  instructorUser,
  superAdminUser,
} from './userData';



const addUsersToFirestore = async () => {
  try {
    await addUser(adminUser);
    await addUser(studentUser);
    await addUser(instructorUser);
    await addUser(superAdminUser);
    console.log('Users added successfully');
  } catch (error) {
    console.error('Error adding users:', error);
  }
};

  export {addUsersToFirestore};