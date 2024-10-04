import React, { useEffect, useState } from 'react';
import Student from './student';
import Instructor from './instructor';
import { getUserDetails } from '../../../../utils/constants';

const TimeTable = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const btechUser = getUserDetails();
    
    if (btechUser && btechUser.role) {
      setUserRole(btechUser.role);
    }
  }, []);

  // Render based on user role
  return (
    <div>
      {userRole === 'student' ? <Student /> : <Instructor />}
    </div>
  );
};

export default TimeTable;
