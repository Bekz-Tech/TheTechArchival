import React, { useEffect, useState } from 'react';
import {
  Box,
  useTheme,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
} from "@mui/material";import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpInstructor, SignUpAdmin } from '../../../signUp';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { deleteUser, updateUserDetails, fetchAndStoreUsers } from '../../../../firebase/utils';
import Modal from '../../components/modal';
import TableComponent from "../../../../components/table";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getOfflineUsers } from '../../../../firebase/utils/getRequest';
import useAuth from '../../../../hooks/useAuth';
import { useSelector } from 'react-redux';

const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const students = useSelector((state) => state.adminData.usersData.allUsersData.Student);
  const instrcutors = useSelector((state) => state.adminData.usersData.allUsersData.Instructor);

  // const 


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
  const [instructors, setInstructors] = useState([]);
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

    const instructorData = instrcutors
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

  console.log(formattedOfflineStudents);

  return (
    <Box m="20px">
      <Header title="User Management" subtitle="Manage users" />

      <Dropdown
        label="Add Users"
        options={[
          { value: "student", label: "Student" },
          { value: "instructor", label: "Instructor" },
          { value: "admin", label: "Admin" },
        ]}
        onSelect={handleRoleSelect}
      />

      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Students" />
          <Tab label="Instructors" />
          <Tab label="Offline Students" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Box m="20px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="User Management"
            data={studentData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={handleRowClick}
          />
        </Box>
      )}

{tabIndex === 1 && (
        <Box m="20px 0 0 0" height="75vh">
          <TableComponent
            columns={columns}
            tableHeader="User Management"
            data={instructorData}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onRowClick={handleRowClick}
          />
        </Box>
      )}

      {tabIndex === 2 && (
        <TableComponent
          columns={columns}
          tableHeader="User Management"
          data={formattedOfflineStudents}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onRowClick={handleRowClick}
        />
      )}

      {selectedUser && (
        <Modal noConfirm open={true} onClose={() => setSelectedUser(null)}>
          <Box p={2}>
            <Typography variant="h6">User Details</Typography>
            <Typography>User ID: {selectedUser.userId}</Typography>
            <Typography>
              Name: {`${selectedUser.firstName} ${selectedUser.lastName}`}
            </Typography>
            <Typography>Email: {selectedUser.email}</Typography>
            <Typography>Phone Number: {selectedUser.phoneNumber}</Typography>
            <Typography>Role: {selectedUser.role}</Typography>
            <Typography>Program: {selectedUser.program}</Typography>
            <Typography>
              Registered Date:{" "}
              {selectedUser.createdAt ? selectedUser.createdAt : "N/A"}
            </Typography>
          </Box>
        </Modal>
      )}

      <Modal
        title="Confirm Delete"
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDelete}
      >
        <Typography>Are you sure you want to delete this user?</Typography>
      </Modal>

      <Modal
        title="Edit User"
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onConfirm={handleEditSubmit}
      >
        <Box>
          <TextField
            label="First Name"
            value={editUserDetailsState.firstName || ""}
            onChange={(e) =>
              setEditUserDetailsState({
                ...editUserDetailsState,
                firstName: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Last Name"
            value={editUserDetailsState.lastName || ""}
            onChange={(e) =>
              setEditUserDetailsState({
                ...editUserDetailsState,
                lastName: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editUserDetailsState.email || ""}
            onChange={(e) =>
              setEditUserDetailsState({
                ...editUserDetailsState,
                email: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone Number"
            value={editUserDetailsState.phoneNumber || ""}
            onChange={(e) =>
              setEditUserDetailsState({
                ...editUserDetailsState,
                phoneNumber: e.target.value,
              })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="program-select-label">Program</InputLabel>
            <Select
              labelId="program-select-label"
              value={selectedProgram || ""}
              onChange={(e) => {
                handleProgramChange(e.target.value);
                setEditUserDetailsState({
                  ...editUserDetailsState,
                  program: e.target.value,
                });
              }}
            >
              {programsAssignedOptions.map((program) => (
                <MenuItem key={program} value={program}>
                  {program}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="instructor-select-label">Instructor</InputLabel>
            <Select
              labelId="instructor-select-label"
              value={selectedInstructor || ""}
              onChange={(e) => setSelectedInstructor(e.target.value)}
            >
              {instructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {`${instructor.firstName} ${instructor.lastName}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
        </Box>
      </Modal>

      {/* user signUp modal */}
      <Modal open={signUpDialogOpen} onClose={() => setSignUpDialogOpen(false)}>
        {selectedRole === "student" && <SignUpStudent />}
        {selectedRole === "instructor" && <SignUpInstructor />}
        {selectedRole === "admin" && <SignUpAdmin />}
      </Modal>
    </Box>
  );
};

export default UserManagement;
