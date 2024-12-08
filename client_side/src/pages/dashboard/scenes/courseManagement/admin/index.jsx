import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import { tokens } from '../../../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the eye icon
import Header from "../../../components/Header";
import Modal from "../../../components/modal";
import useCourses from './useCourses';
import { AddCurriculumModal, AddCourseModal, AddCohortModal, COurseDetailsModal } from './courseModals';
import { useSelector } from 'react-redux';
import TableComponent from "../../../../../components/table"; // Import your custom TableComponent

const Admin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const {
    addCurriculumOpen,
    courses,
    addCourseModalOpen,
    updateCurriculumModalOpen,
    selectedCourse,
    handleAddCourse,
    handleUpdateCurriculum,
    handleDeleteCourse,
    openAddCourseModal,
    closeAddCourseModal,
    closeUpdateCurriculumModal,
    openCourseDetailsModal,
    closeCourseDetailsModal,
    openCohortAddModal,
    closeCohortAddModal,
    openAddCurriculumModal,
    closeAddCurriculumModal,
    cohortAddModalOpen,
  } = useCourses();

  const userRole = useSelector((state) => state.users.user.role);

  // Sorting and pagination state
  const [sortBy, setSortBy] = useState('courseName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  console.log(selectedCourse);

  // Columns for the Table
  const columns = [
    { id: 'sn', label: 'S/N' }, // Adding serial number column
    { id: 'courseName', label: 'Course Name' },
    { id: 'description', label: 'Description' },
    { id: 'duration', label: 'Duration' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'cost', label: 'Cost' },
    {
      id: 'actions',
      label: 'Actions',
      renderCell: (row) => (
        <>
          <Tooltip title="View Details">
            <IconButton onClick={() => openCourseDetailsModal(row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit Curriculum">
            <IconButton onClick={() => handleAddCurriculum(row.id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Course">
            <IconButton onClick={() => handleDeleteCourse(row.id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Manage Curriculum">
            <Button onClick={() => handleUpdateCurriculum(row.id)} variant="contained" color="primary">
              Curriculum
            </Button>
          </Tooltip>
        </>
      ),
    },
  ];

  const rows = courses.map((course, index) => ({
    sn: index + 1, // Adding serial number (S/N)
    id: course.courseId,
    courseName: course.courseName,
    description: course.description,
    duration: course.duration,
    startDate: course.startDate,
    cost: course.cost,
  }));

  // Handle sorting changes
  const handleSortChange = (columnId) => {
    const isAscending = sortBy === columnId && sortDirection === 'asc';
    setSortBy(columnId);
    setSortDirection(isAscending ? 'desc' : 'asc');
  };

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset page to 0 when rows per page change
  };

  // Handle row click to open course details
  const handleRowClick = (row) => {
    console.log('hey')
  };

  // Filter data based on search query
  const filteredRows = rows.filter((row) => {
    return row.courseName.toLowerCase().includes(searchQuery.toLowerCase());
  });
  console.log(selectedCourse)

  return (
    <Grid container spacing={3} px={3}>
      <Grid item xs={12}>
        <Header title={userRole === "admin" || userRole === "superadmin" ? "Course Management" : 'Course Details'} 
                subtitle={userRole === "admin" || userRole === "superadmin" ? "Manage Courses" : 'See course curriculum'} />
      </Grid>

      {userRole === "admin" || userRole === "superadmin" && (
        <div style={{ width: "100%" }}>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ padding: '20px', backgroundColor: colors.background }}>
              <Typography variant="h3" gutterBottom>
                Courses
              </Typography>

              {/* Display courses using TableComponent */}
              <TableComponent
                columns={columns}
                tableHeader="Course Management"
                data={filteredRows}
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onRowClick={handleRowClick}
              />

              <Button onClick={openAddCourseModal} variant="contained" color="primary" style={{ marginTop: '20px' }}>
                Add Course
              </Button>
            </Paper>
          </Grid>
        </div>
      )}

      {/* Course Details Modal */}
      <Modal open={selectedCourse !== null} onClose={closeCourseDetailsModal} title={selectedCourse?.courseName}>
        {selectedCourse && (
         <COurseDetailsModal 
            userRole = {userRole} 
            selectedCourse = {selectedCourse}
            openAddCurriculumModal={openAddCurriculumModal}
            openCohortAddModal={openCohortAddModal}
            />
        )}
      </Modal>

      {/* Modals for Adding Course, Cohort, and Curriculum */}
      <Modal open={addCourseModalOpen} onClose={closeAddCourseModal} title="Add New Course">
        <AddCourseModal />
      </Modal>

      <Modal open={cohortAddModalOpen} onClose={closeCohortAddModal} title="Add Cohort" noConfirm>
        <AddCohortModal courseId={selectedCourse?.id} />
      </Modal>

      {/* Add Curriculum Modal */}
    <Modal open={addCurriculumOpen} onClose={closeAddCurriculumModal} title="Add Curriculum" noConfirm>
      <AddCurriculumModal courseId={selectedCourse?.id} />
    </Modal>
    </Grid>
  );
};

export default Admin;
