
const getUserDetails = () => {
  const userKey = 'btech_user';
  const storedUserDetails = sessionStorage.getItem(userKey);
  if (storedUserDetails) {
    const userDetails = JSON.parse(storedUserDetails);
    console.log(userDetails);
    return userDetails;
  }
};

const getAllUserDetails = () => {
  const userKey = 'btech_users';
  const storedUserDetails = sessionStorage.getItem(userKey);
  if (storedUserDetails) {
    const userDetails = JSON.parse(storedUserDetails);
    return userDetails;
  }
};

export { getUserDetails, getAllUserDetails };
