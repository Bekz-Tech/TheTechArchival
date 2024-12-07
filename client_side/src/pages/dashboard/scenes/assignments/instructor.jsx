import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table'; // Adjust the import path as needed
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // For view submissions button
import { useSelector } from 'react-redux';
import useApi from '../../../../hooks/useApi';

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '' });
  const [sortBy, setSortBy] = useState('sn');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewSubmissionsModal, setViewSubmissionsModal] = useState(false); // Modal for viewing submissions
  const [submissions, setSubmissions] = useState([]); // Store submissions for the selected assignment
  const [openDeleteModal, setOpenDeleteModal] = useState(false); // Modal for confirmation before delete
  const [assignmentToDelete, setAssignmentToDelete] = useState(null); // Store assignment to delete

  const userDetails = useSelector((state) => state.users.user);
  const cohortName = userDetails.cohort;
  const postUrl = `http://localhost:3500/${cohortName}/assignments`;

  const { loading: postLoading, data: postData, error: postError, callApi: postCallApi } = useApi();
  const { loading: getLoading, error: getError, callApi: getCallApi } = useApi();
  const { loading: putLoading, data: putData, error: putError, callApi: putCallApi } = useApi();
  const { loading: deleteLoading, data: deleteData, error: deleteError, callApi: deleteCallApi } = useApi();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (postUrl) {
        const data = await getCallApi(postUrl, 'GET');
        setAssignments(data);
      }
    };

    fetchSchedules();
  }, []);

  const sortAssignments = (assignments) => {
    return assignments.sort((a, b) => (b?.id || 0) - (a?.id || 0));
  };

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setNewAssignment({
        title: assignment.title,
        dueDate: assignment.dueDate,
        description: assignment.description,
      });
    } else {
      setSelectedAssignment(null);
      setNewAssignment({ title: '', dueDate: '', description: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmit = async () => {
    try {
      if (selectedAssignment) {
        // Update assignment via the API using PUT request
        const response = await putCallApi(
          `${postUrl}/${selectedAssignment._id}`,
          'PUT',
          newAssignment
        );

        // If the update is successful, update assignments in local state
        if (response) {
          const updatedAssignments = assignments.map(a =>
            a.id === selectedAssignment.id ? { ...a, ...newAssignment } : a
          );
          setAssignments(sortAssignments(updatedAssignments)); // Sort after update
        }
      } else {
        // Add new assignment via the API using POST request
        const response = await postCallApi(postUrl, 'POST', newAssignment);

        // If post is successful, add the new assignment to the state
        if (response) {
          const newAssignmentWithId = { ...newAssignment, id: assignments.length + 1 };
          const updatedAssignments = [...assignments, newAssignmentWithId];
          setAssignments(sortAssignments(updatedAssignments)); // Sort after adding
        }
      }

      handleCloseModal(); // Close the modal after submitting
    } catch (error) {
      console.error('Error submitting assignment: ', error);
    }
  };

  const handleDeleteAssignment = (assignment) => {
    setAssignmentToDelete(assignment);
    setOpenDeleteModal(true); // Show confirmation modal
  };

  const confirmDeleteAssignment = async () => {
    try {
      // Delete assignment using DELETE request
      const response = await deleteCallApi(
        `${postUrl}/${assignmentToDelete._id}`,
        'DELETE'
      );
      // If delete is successful, update assignments in local state
      if (response) {
        const updatedAssignments = assignments.filter(a => a.id !== assignmentToDelete.id);
        setAssignments(sortAssignments(updatedAssignments)); // Sort after deletion
      }
      setOpenDeleteModal(false); // Close confirmation modal after delete
    } catch (error) {
      console.error('Error deleting assignment: ', error);
      setOpenDeleteModal(false); // Close confirmation modal on error
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteModal(false); // Close confirmation modal without deleting
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissions(assignment.submissions || []); // Populate submissions from the assignment
    setViewSubmissionsModal(true);
  };

  const handleCloseSubmissionsModal = () => {
    setViewSubmissionsModal(false);
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
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAssignment(prevState => ({ ...prevState, [name]: value }));
  };

  // Columns definition with actions
  const columns = [
    { id: 'sn', label: 'S/N', minWidth: 50 },
    { id: 'title', label: 'Title', minWidth: 100 },
    { id: 'dueDate', label: 'Due Date', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 150 },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      renderCell: (row) => (
        <Box display="flex" justifyContent="space-between">
          <IconButton onClick={() => handleOpenModal(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteAssignment(row)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => handleViewSubmissions(row)}>
            <VisibilityIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="ASSIGNMENTS"
        subtitle="Overview of Assignments"
      />
    
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        sx={{ mb: '15px' }}
      >
        Add Assignment
      </Button>
      <TableComponent
        columns={columns}
        tableHeader="Overview of Assignments"
        data={assignments.map((assignment, index) => ({
          ...assignment,
          sn: index + 1, // This will reflect the current index
        }))} 
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onRowClick={handleRowClick}
      />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={selectedAssignment ? "Update Assignment" : "Add Assignment"}
        onConfirm={handleSubmit}
      >
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            type="text"
            name="title"
            label="Title"
            value={newAssignment.title}
            onChange={handleInputChange}
            required
          />
          <TextField
            type="date"
            name="dueDate"
            label="Due Date"
            value={newAssignment.dueDate}
            onChange={handleInputChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="text"
            name="description"
            label="Description"
            value={newAssignment.description}
            onChange={handleInputChange}
            required
            multiline
            rows={4}
          />
        </Box>
      </Modal>

      {/* Confirmation Modal for Deleting Assignment */}
      <Modal
        open={openDeleteModal}
        onClose={handleCancelDelete}
        title="Confirm Deletion"
        onConfirm={confirmDeleteAssignment}
      >
        <Box>
          <p>Are you sure you want to delete this assignment?</p>
        </Box>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        open={viewSubmissionsModal}
        onClose={handleCloseSubmissionsModal}
        title="View Submissions"
        onConfirm={handleCloseSubmissionsModal}
      >
        <Box>
          {submissions.length === 0 ? (
            <p>No submissions yet.</p>
          ) : (
            <ul>
              {submissions.map((submission, index) => (
                <li key={index}>{submission.studentName} - {submission.status}</li>
              ))}
            </ul>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Assignment;
