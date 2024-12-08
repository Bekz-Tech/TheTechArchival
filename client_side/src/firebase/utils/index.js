import { handleSignUp, logout } from "./auth";
import { 
  addUser, 
  submitEnquiry, 
  addCourse, 
  addTimetableToInstructors,
  addAssignmentToInstructors} from "./postRequest";
import {
  fetchAndStoreUsers,
  fetchEnquiries,
  fetchUserDetailsByEmailAndRole,
  fetchCourses,
  fetchTimetables,
  fetchPayments
      } from "./getRequest";

import {
  deleteUser,
  deleteEnquiry,
  deleteTimetable
 } from "./deleteRequest";
import {
  updateUserDetails,
  updateEnquiryReadStatus,
  updateCourseCurriculum,
  updateTimetable,
  updateAssignment
} from "./updateRequest";

import { listenForInstructorChanges } from "./realtimeData/instuctorChange";


//exports
export {
  handleSignUp,
  addUser,
  logout,
  fetchUserDetailsByEmailAndRole,
  fetchAndStoreUsers,
  deleteUser,
  updateUserDetails,
  submitEnquiry,
  fetchEnquiries,
  updateEnquiryReadStatus,
  deleteEnquiry,
  addCourse,
  updateCourseCurriculum,
  fetchCourses,
  addTimetableToInstructors,
  updateTimetable,
  deleteTimetable,
  fetchTimetables,
  fetchPayments,
  listenForInstructorChanges,
  addAssignmentToInstructors,
  updateAssignment
};
