import React, { useEffect, useState } from 'react';
import Student from './student';
import Instructor from './instructor';
import useSessionStorage from '../../../../hooks/useSessionStorage';

const TimeTable = () => {
     // Fetch user data from localStorage
     const btechUser = useSessionStorage().memoizedUserDetails;
     const userRole = btechUser.role;

   // Render based on user role
   return (
     <div>
       {userRole === 'student' ? <Student /> : <Instructor babtechUser = {btechUser}/>}
     </div>
   );
 };

export default TimeTable;
