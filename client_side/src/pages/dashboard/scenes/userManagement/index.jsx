import React, { useEffect, useState } from 'react';
import { Box, useTheme, IconButton, Typography, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dropdown from '../../../../components/dropdown';
import { SignUpStudent, SignUpInstructor, SignUpAdmin } from '../../../signUp';
import { tokens } from '../../theme';
import Header from '../../components/Header';
import { deleteUser, updateUserDetails, fetchAndStoreUsers } from '../../../../firebase/utils';
import Modal from '../../components/modal';
import TableComponent from "../../../../components/table";

const UserManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedRole, setSelectedRole] = useState('');
  const [userData, setUserData] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserDetailsState, setEditUserDetailsState] = useState({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Check if users are stored in session storage
      const storedUsers = sessionStorage.getItem('btech_users');
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
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
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
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await updateUserDetails(editUserDetailsState.email, editUserDetailsState);
      const updatedUserData = userData.map(user =>
        user.id === editUserDetailsState.id ? editUserDetailsState : user
      );
      setUserData(updatedUserData);
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      const updatedUserData = userData.filter(user => user.id !== selectedUser.id);
      setUserData(updatedUserData);
      setConfirmDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns = [
    { id: 'sn', label: 'S/N', width: 90 },
    { id: 'userId', label: 'User ID', width: 150 },
    { id: 'name', label: 'Name', flex: 1 },
    { id: 'phoneNumber', label: 'Phone Number', flex: 1 },
    { id: 'role', label: 'Role', width: 150 },
    { id: 'program', label: 'Program', width: 150 },
    { id: 'registeredDate', label: 'Registered Date', flex: 1 },
    {
      id: 'actions', label: 'Actions', width: 150, renderCell: (row) => (
        <div className="action-buttons">
          <IconButton onClick={() => handleEdit(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => { setConfirmDialogOpen(true); setSelectedUser(row); }}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const formattedUserData = userData.map((user, index) => ({
    id: user.userId,
    sn: index + 1,
    userId: user.id,
    name: `${user.firstName} ${user.lastName}`,
    phoneNumber: user.phoneNumber,
    role: user.role, // Ensure role is included
    program: user.program, // Ensure program is included
    registeredDate: user.createdAt.toLocaleString(), // Maintain exact date format
  }));

  return (
    <Box m="20px">
      <Header title="User Management" subtitle="Manage users" />

      <Dropdown
        label="Add Users"
        options={[
          { value: 'student', label: 'Student' },
          { value: 'instructor', label: 'Instructor' },
          { value: 'admin', label: 'Admin' }
        ]}
        onSelect={handleRoleSelect}
      />

      <Box
        m="20px 0 0 0"
        height="75vh"
      >
        <TableComponent
          columns={columns}
          tableHeader="User Management"
          data={formattedUserData}
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

      {selectedUser && (
        <Modal noConfirm open={true} onClose={() => setSelectedUser(null)}>
          <Box p={2}>
            <Typography variant="h6">User Details</Typography>
            <Typography>User ID: {selectedUser.userId}</Typography>
            <Typography>Name: {`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
            <Typography>Email: {selectedUser.email}</Typography>
            <Typography>Phone Number: {selectedUser.phoneNumber}</Typography>
            <Typography>Role: {selectedUser.role}</Typography>
            <Typography>Program: {selectedUser.program}</Typography>
            <Typography>Registered Date: {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
          </Box>
        </Modal>
      )}

      <Modal
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        title="Edit User Details"
        styleProps={{ backgroundColor: colors.primary[500], color: colors.grey[100], padding: theme.spacing(2) }}
        onConfirm={handleEditSubmit}
        confirmMessage="Are you sure you want to save changes?"
      >
        <TextField
          label="First Name"
          value={editUserDetailsState.firstName || ''}
          onChange={(e) => setEditUserDetailsState({ ...editUserDetailsState, firstName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Last Name"
          value={editUserDetailsState.lastName || ''}
          onChange={(e) => setEditUserDetailsState({ ...editUserDetailsState, lastName: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          value={editUserDetailsState.email || ''}
          onChange={(e) => setEditUserDetailsState({ ...editUserDetailsState, email: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone Number"
          value={editUserDetailsState.phoneNumber || ''}
          onChange={(e) => setEditUserDetailsState({ ...editUserDetailsState, phoneNumber: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Role"
          value={editUserDetailsState.role || ''}
          onChange={(e) => setEditUserDetailsState({ ...editUserDetailsState, role: e.target.value })}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Program"
          value={editUserDetailsState.program || ''}
          onChange={(e) => setEditUserDetailsState({ ...editUserDetailsState, program: e.target.value })}
          fullWidth
          margin="normal"
        />
      </Modal>

      <Modal
        open={signUpDialogOpen}
        onClose={() => setSignUpDialogOpen(false)}
        title={`Sign Up ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`}
        styleProps={{ backgroundColor: colors.primary[500], color: colors.grey[100], padding: theme.spacing(2) }}
        noConfirm
        confirmMessage={`Are you sure you want to sign up this ${selectedRole}?`}
      >
        {selectedRole === 'student' && <SignUpStudent />}
        {selectedRole === 'instructor' && <SignUpInstructor />}
        {selectedRole === 'admin' && <SignUpAdmin />}
      </Modal>

      <Modal
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title="Confirm Delete"
        styleProps={{ backgroundColor: colors.primary[500], color: colors.grey[100], padding: theme.spacing(2) }}
        onConfirm={handleDelete}
        confirmMessage={`Are you sure you want to delete ${selectedUser ? selectedUser.firstName : ''}?`}
      >
        <p>Are you sure you want to delete {selectedUser ? selectedUser.firstName : ''}?</p>
      </Modal>
    </Box>
  );
};

export default UserManagement;
