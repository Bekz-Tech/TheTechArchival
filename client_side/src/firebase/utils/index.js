import { handleSignUp, logout } from "./auth";
import { 
  addUser, 
  submitEnquiry, 
  addCourse, 
  addTimetableToInstructors} from "./postRequest";
import {
  fetchAndStoreUsers,
  fetchEnquiries,
  fetchUserDetailsByEmailAndRole,
  fetchCourses,
  fetchTimetables
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
  updateTimetable
} from "./updateRequest";

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
  fetchTimetables
};
