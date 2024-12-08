import React, { useState, useEffect } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { tokens } from '../../theme';
import { useTheme } from '@mui/material';
import Header from '../../components/Header';
import Modal from '../../components/modal';
import TableComponent from '../../../../components/table';

const Assignment = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', dueDate: '', description: '' });
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const mockAssignments = [
    { id: 1, title: 'Math Homework', dueDate: '2024-07-21', description: 'Solve all exercises on page 42.' },
    { id: 2, title: 'Science Project', dueDate: '2024-07-22', description: 'Build a model of the solar system.' },
    { id: 3, title: 'History Essay', dueDate: '2024-07-23', description: 'Write an essay on the French Revolution.' },
    { id: 4, title: 'English Assignment', dueDate: '2024-07-24', description: 'Read Chapter 5 and answer the questions.' },
    { id: 5, title: 'Physical Education', dueDate: '2024-07-25', description: 'Practice the exercises shown in class.' },
  ];

  useEffect(() => {
    // Simulating API call to fetch assignments
    setTimeout(() => {
      setAssignments(mockAssignments);
    }, 1000);
  }, []);

  const handleOpenModal = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setNewAssignment(assignment);
    } else {
      setSelectedAssignment(null);
      setNewAssignment({ title: '', dueDate: '', description: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirm = () => {
    if (selectedAssignment) {
      // Update existing assignment
      setAssignments(assignments.map(a => a.id === selectedAssignment.id ? { ...newAssignment, id: selectedAssignment.id } : a));
    } else {
      // Add new assignment
      setAssignments([...assignments, { ...newAssignment, id: assignments.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'description', label: 'Description' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <Button
          onClick={() => handleOpenModal(row)}
          sx={{ color: colors.greenAccent[500] }}
        >
          Edit
        </Button>
      ),
    },
  ];

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

  return (
    <Box m="20px">
      <Header
        title="ASSIGNMENTS"
        subtitle="Overview of Assignments"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleOpenModal()}
          sx={{ mb: 2, backgroundColor: colors.greenAccent[500] }}
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
        </Box>
      </Modal>
    </Box>
  );
};

export default Assignment;
