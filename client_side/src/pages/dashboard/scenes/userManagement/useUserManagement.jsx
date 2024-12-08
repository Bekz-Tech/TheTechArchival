import { useState, useEffect } from 'react';
import { getOfflineUsers } from '../../../../firebase/utils/getRequest';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser, updateUserDetails, fetchAndStoreUsers } from '../../../../firebase/utils';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton,Typography} from "@mui/material";


const useUserManagement = () => {
  const students = useSelector((state) => state.adminData.usersData.students);
  const instructors = useSelector((state) => state.adminData.usersData.instructors);



  const [selectedRole, setSelectedRole] = useState("");
  const [userData, setUserData] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserDetailsState, setEditUserDetailsState] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [offlineStudents, setOfflineStudents] = useState([]);

  // Mock data for offline students

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profile_pictures/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log('called')
      const storedUsers = sessionStorage.getItem("btech_users");
      const offlineUsers = await getOfflineUsers();
      setOfflineStudents(offlineUsers);
      

      if (storedUsers) {
        setUserData(JSON.parse(storedUsers));
      } else {
        const users = await fetchAndStoreUsers();
        setUserData(users);
      }
    };

    fetchData();
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setSignUpDialogOpen(true);
  };

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (row) => {
    setSelectedUser(row);
  };

  const handleEdit = (user) => {
    setEditUserDetailsState(user);
    setProfileImageUrl(user.profilePicture || "");
    setEditDialogOpen(true);

    setSelectedProgram(user.program);

    const filteredInstructors = userData.filter(
      (instructor) =>
        instructor.role === "instructor" &&
        Array.isArray(instructor.programsAssigned) &&
        instructor.programsAssigned.includes(user.program)
    );

    setInstructors(filteredInstructors);
  };

  const handleProgramChange = (program) => {
    setSelectedProgram(program);

    const filteredInstructors = userData.filter(
      (instructor) =>
        instructor.role === "instructor" &&
        Array.isArray(instructor.programsAssigned) &&
        instructor.programsAssigned.includes(program)
    );

    setInstructors(filteredInstructors);
  };

  const handleEditSubmit = async () => {
    try {
      let imageUrl = profileImageUrl;

      if (profileImage) {
        imageUrl = await handleImageUpload(profileImage);
        setProfileImageUrl(imageUrl);
      }

      const updatedUserDetails = {
        ...editUserDetailsState,
        profilePicture: imageUrl,
      };

      if (selectedInstructor) {
        updatedUserDetails.assignedInstructor = selectedInstructor;
      }

      await updateUserDetails(editUserDetailsState.id, updatedUserDetails);

      const updatedUserData = userData.map((user) =>
        user.id === editUserDetailsState.id ? updatedUserDetails : user
      );
      setUserData(updatedUserData);
      setEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      const updatedUserData = userData.filter(
        (user) => user.id !== selectedUser.id
      );
      setUserData(updatedUserData);
      setConfirmDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const columns = [
    { id: "sn", label: "S/N", width: 90 },
    {
      id: "userId",
      label: "User ID",
      width: 100,
      renderCell: (row) => (
        <Typography
          sx={{
            width: "100px", // Adjust the width according to your requirement
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            display: "block",
          }}
        >{`${row.userId}`}</Typography>
      ),
    },
    { id: "name", label: "Name", flex: 1 },
    { id: "phoneNumber", label: "Phone Number", flex: 1 },
    { id: "role", label: "Role", width: 150 },
    { id: "program", label: "Program", width: 150 },
    { id: "registeredDate", label: "Registered Date", flex: 1 },
    {
      id: "actions",
      label: "Actions",
      width: 150,
      renderCell: (row) => (
        <div className="action-buttons">
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setConfirmDialogOpen(true);
              setSelectedUser(row);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  console.log(userData);

  const studentData = students
    .map((user, index) => ({
      id: user.userId,
      sn: index + 1,
      role: user.role,
      userId:
        user.role === "student"
          ? `${user.studentId}` || "N/A"
          : user.role === "instructor"
          ? user.instructorId || "N/A"
          : user.userId || "N/A",
      name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
      phoneNumber: user.phoneNumber || "N/A",
      program: user.program || "N/A",
      registeredDate: user.createdAt || "N/A",
    }))
    .sort((a, b) => a.sn - b.sn); // Sorting by S/N in ascending order<

    const instructorData = instructors
    .map((user, index) => ({
      id: user.userId,
      sn: index + 1,
      role: user.role,
      userId:
        user.role === "student"
          ? `${user.studentId}` || "N/A"
          : user.role === "instructor"
          ? user.instructorId || "N/A"
          : user.userId || "N/A",
      name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
      phoneNumber: user.phoneNumber || "N/A",
      program: user.program || "N/A",
      registeredDate: user.createdAt || "N/A",
    }))
    .sort((a, b) => a.sn - b.sn); // Sorting by S/N in ascending order
  
  
console.log(offlineStudents)
  //formattted offline student data
  const formattedOfflineStudents = offlineStudents
    .map((user, index) => ({
      id: user.userId,
      sn: index + 1,
      role: user.role,
      userId: user.studentId,
      name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
      phoneNumber: user.phoneNumber || "N/A",
      program: user.program || "N/A",
      registeredDate: user.createdAt || "N/A",
    }))
    .sort((a, b) => a.sn - b.sn); // Sorting by S/N in ascending order

  const getUniqueProgramsAssigned = () => {
    const assignedPrograms = [];
    userData.forEach((user) => {
      if (user.role === "instructor" && Array.isArray(user.programsAssigned)) {
        assignedPrograms.push(...user.programsAssigned);
      }
    });
    return [...new Set(assignedPrograms)];
  };

  const programsAssignedOptions = getUniqueProgramsAssigned();

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };


  return {
    studentData,
    instructorData,
    selectedRole,
    setSelectedRole,
    userData,
    setUserData,
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    selectedUser,
    setSelectedUser,
    editUserDetailsState,
    setEditUserDetailsState,
    confirmDialogOpen,
    setConfirmDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    signUpDialogOpen,
    setSignUpDialogOpen,
    profileImage,
    setProfileImage,
    profileImageUrl,
    setProfileImageUrl,
    selectedInstructor,
    setSelectedInstructor,
    selectedProgram,
    setSelectedProgram,
    offlineStudents,
    setOfflineStudents,
    handleImageUpload,
    handleRoleSelect,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    handleRowClick,
    handleEdit,
    handleProgramChange,
    handleEditSubmit,
    handleDelete,
    programsAssignedOptions,
    columns,
    tabIndex,
    handleTabChange,
    instructors
  };
};

export default useUserManagement;
