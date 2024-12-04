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
} from "@mui/material";
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpInstructor, SignUpAdmin } from '../../../signUp';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from "../../../../components/table";
import useUserManagement from './useUserManagement';


const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    instructors,
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
    handleTabChange
  } = useUserManagement();
  

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
