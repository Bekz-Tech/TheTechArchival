import React, { useEffect, useState } from 'react';
import Instructors from './instructor';
import Admin from './admin';


const TimeTable = () => {
  const [userRole, setUserRole] = useState(null);

  console.log("here")

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
      {userRole === 'admin' || "superadmin" ? <Admin /> : <Instructors />}
    </div>
  );
};

export default TimeTable;
