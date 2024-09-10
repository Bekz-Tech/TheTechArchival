import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table'; // Adjust the import path as needed
import { addAssignmentToInstructors } from '../../../../firebase/utils/postRequest'; // Adjust the path

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '', courseId: '' });
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [courses, setCourses] = useState([]); // State to hold list of courses

  // Mock data for assignments
  const mockAssignments = [
    { id: 1, title: 'Math Homework', dueDate: '2024-07-21', description: 'Solve all exercises on page 42.', courseId: 'course1' },
    { id: 2, title: 'Science Project', dueDate: '2024-07-22', description: 'Build a model of the solar system.', courseId: 'course2' },
    { id: 3, title: 'History Essay', dueDate: '2024-07-23', description: 'Write an essay on the French Revolution.', courseId: 'course3' },
  ];

  // Mock data for courses
  const mockCourses = [
    { courseId: 'course1', courseName: 'Math 101' },
    { courseId: 'course2', courseName: 'Science 101' },
    { courseId: 'course3', courseName: 'History 101' },
  ];

  // Column definitions for the table
  const columns = [
    { id: 'id', label: 'ID', minWidth: 50 },
    { id: 'title', label: 'Title', minWidth: 100 },
    { id: 'dueDate', label: 'Due Date', minWidth: 100 },
    { id: 'description', label: 'Description', minWidth: 150 },
    { id: 'courseId', label: 'Course ID', minWidth: 100 },
  ];

  useEffect(() => {
    // Simulate API call to fetch assignments
    setTimeout(() => {
      setAssignments(mockAssignments);
    }, 1000);

    // Simulate API call to fetch courses
    setCourses(mockCourses);
  }, []);

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setNewAssignment(assignment);
    } else {
      setSelectedAssignment(null);
      setNewAssignment({ title: '', dueDate: '', description: '', courseId: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = async () => {
    try {
      if (selectedAssignment) {
        // Update existing assignment
        setAssignments(assignments.map(a => a.id === selectedAssignment.id ? { ...newAssignment, id: selectedAssignment.id } : a));
      } else {
        // Add new assignment locally
        const updatedAssignments = [...assignments, { ...newAssignment, id: assignments.length + 1 }];
        setAssignments(updatedAssignments);

        // Add assignment to instructors' courses
        await addAssignmentToInstructors(newAssignment); 
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error updating assignments: ', error);
    }
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
          data={assignments}
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
            {courses.map((course) => (
              <option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </option>
            ))}
          </TextField>
        </Box>
      </Modal>
    </Box>
  );
};

export default Assignment;
