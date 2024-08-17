import { handleSignUp, logout } from "./auth";
import { addUser, submitEnquiry, addCourse} from "./postRequest";
import {
  fetchAndStoreUsers,
  fetchEnquiries,
  fetchUserDetailsByEmailAndRole,
      } from "./getRequest";
import { deleteUser, deleteEnquiry } from "./deleteRequest";
import {
  updateUserDetails,
  updateEnquiryReadStatus,
  updateCourseCurriculum} from "./updateRequest";

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
  updateCourseCurriculum
};
