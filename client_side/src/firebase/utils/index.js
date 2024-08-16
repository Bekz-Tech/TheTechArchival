import { handleSignUp, logout } from "./auth";
import { addUser, submitEnquiry } from "./postRequest";
import {
  fetchAndStoreUsers,
  fetchEnquiries,
  fetchUserDetailsByEmailAndRole,
      } from "./getRequest";
import { deleteUser, deleteEnquiry } from "./deleteRequest";
import { updateUserDetails, updateEnquiryReadStatus } from "./updateRequest";

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
  deleteEnquiry
};
