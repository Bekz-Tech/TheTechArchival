import React, { useEffect, useState } from 'react';
import Student from './student';
import Instructor from './instructor';

const TimeTable = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Fetch user data from localStorage
    const btechUser = JSON.parse(localStorage.getItem('btech_user'));
    
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
