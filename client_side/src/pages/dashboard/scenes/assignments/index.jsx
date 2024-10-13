import Student from './student';
import Instructor from './instructor';
import useSessionStorage from '../../../../hooks/useSessionStorage';

const Assignment = () => {
    // Fetch user data from localStorage
    const btechUser = useSessionStorage().memoizedUserDetails;
    const userRole = btechUser.role;
  

  // Render based on user role
  return (
    <div>
      {userRole === 'student' ? <Student/> : <Instructor user = {btechUser}/>}
    </div>
  );
};

export default Assignment;
