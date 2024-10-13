import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, IconButton } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table'; // Adjust the import path as needed
import { addAssignmentToInstructors } from '../../../../firebase/utils/postRequest';
import useSessionStoarge from '../../../../hooks/useSessionStorage'; // Assume this fetches user details
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility'; // For view submissions button
import { updateAssignment } from '../../../../firebase/utils';

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '', courseId: '', createdBy: '' });
  const [sortBy, setSortBy] = useState('sn');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [courses, setCourses] = useState([]); // State to hold list of courses
  const [viewSubmissionsModal, setViewSubmissionsModal] = useState(false); // Modal for viewing submissions

  // Fetch user details and assignments
  useEffect(() => {
    const fetchData = async ({user: userDetails}) => {
      try {
  
        // Use the response directly to set courses and assignments
        if (userDetails.courses) {
          setCourses(userDetails.courses);  // Set courses from the fetched userDetails
          console.log('Courses set:', userDetails.courses);
  
          const allAssignments = userDetails.courses.flatMap(course => course.assignments || []);
          setAssignments(sortAssignments(allAssignments));
        } else {
          console.error('No courses found in user details.');
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);
  
  

  const sortAssignments = (assignments) => {
    return assignments.sort((a, b) => (b?.id || 0) - (a?.id || 0));
  };

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      const course = courses.find(course => course?.courseName === assignment.courseName);
      setNewAssignment({
        title: assignment.title,
        dueDate: assignment.dueDate,
        description: assignment.description,
        courseId: course ? course.courseId : '',
        createdBy: assignment.createdBy
      });
    } else {
      setSelectedAssignment(null);
      setNewAssignment({ title: '', dueDate: '', description: '', courseId: '', createdBy: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = async () => {
    try {
      if (selectedAssignment) {
        await updateAssignment(selectedAssignment.id, newAssignment, userDetails.email, userDetails.role);
        // Update assignments in local state after confirming changes
        const updatedAssignments = assignments.map(a =>
          a.id === selectedAssignment.id ? { ...a, ...newAssignment } : a
        );
        setAssignments(sortAssignments(updatedAssignments)); // Sort after update
      } else {
        // Add new assignment locally
        const newAssignmentWithId = { ...newAssignment, id: assignments.length + 1 };
        const updatedAssignments = [...assignments, newAssignmentWithId];
        setAssignments(sortAssignments(updatedAssignments)); // Sort after adding

        // Add assignment to instructors' courses
        if (userDetails) {
          await addAssignmentToInstructors(newAssignment, userDetails.userId, newAssignment.courseId, userDetails.email, userDetails.role); // Pass userId and courseId
        } else {
          console.error('User details are not available.');
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error updating assignments: ', error);
    }
  };

  const handleDeleteAssignment = (assignmentId) => {
    const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
    setAssignments(sortAssignments(updatedAssignments)); // Sort after deletion
    // Optionally, add logic to delete the assignment from the database
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
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
    { id: 'courseName', label: 'Course Name', minWidth: 150 },
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
          <IconButton onClick={() => handleDeleteAssignment(row.id)}>
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
      <Box
        m="40px 0 0 0"
        height="75vh"
        display="grid"
        gap="5%"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          sx={{ mb: 2, backgroundColor: colors.greenAccent[500], width: "15%" }}
        >
          Add Assignment
        </Button>
        <TableComponent
          columns={columns}
          tableHeader="Overview of Assignments"
          data={assignments.map((assignment, index) => ({
            ...assignment,
            sn: index + 1, // This will reflect the current index
            courseName: courses.find(course => course.courseName === assignment.courseName)?.courseName || '',
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
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={selectedAssignment ? "Update Assignment" : "Add Assignment"}
        onConfirm={handleConfirm}
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
          <TextField
            select
            label="Course"
            name="courseId"
            value={newAssignment.courseId}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
            }}
            helperText="Please select the course"
            required
          >
            <option value="" disabled>Select a course</option>
            {courses.map((course, index) => (
              <option key={course.id || index} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </TextField>
        </Box>
      </Modal>

      {/* View Submissions Modal */}
      <Modal
        open={viewSubmissionsModal}
        onClose={handleCloseSubmissionsModal}
        title="View Submissions"
        onConfirm={handleCloseSubmissionsModal} // Placeholder for now
      >
        {/* Content for viewing submissions will go here */}
      </Modal>
    </Box>
  );
};

export default Assignment;
