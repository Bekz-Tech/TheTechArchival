import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import TableComponent from '../../../../components/table';
import { getUserDetails } from '../../../../utils/constants';
import { fetchTimetables } from '../../../../firebase/utils';

const TimeTable = () => {
  const [schedules, setSchedules] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const studentDetails = getUserDetails();
    if (!studentDetails?.assignedInstructor || !studentDetails.assignedInstructor.courses) return;

    // Destructure userId from assignedInstructor
    const { userId: instructorUserId } = studentDetails.assignedInstructor;

    // Extract courseIds from the assignedInstructor.courses array
    const courseIds = studentDetails.assignedInstructor.courses.map(course => ({
      courseId: course.courseId,
      courseName: course.courseName
    }));

    // Fetch the timetables and filter based on instructorUserId and courseIds
    const getTimetable = async () => {
      try {
        const timetables = await fetchTimetables(); // Fetch all timetables

        // Filter timetables where userId and courseId match the instructor's userId and any of the courseIds
        const filteredTimetables = timetables.filter((timetable) =>
          timetable.userId === instructorUserId &&
          courseIds.some(course => course.courseId === timetable.courseId && course.courseName === timetable.courseName)
        );

        // Modify the schedules to include the 'Complete' field based on 'done'
        const modifiedSchedules = filteredTimetables.map(schedule => ({
          ...schedule,
          complete: schedule.done ? 'Yes' : 'Not' // Add 'complete' field based on 'done'
        }));

        setSchedules(modifiedSchedules);
      } catch (error) {
        console.error('Error fetching timetables:', error);
      }
    };

    getTimetable();
  }, []);

  const columns = [
    { id: 'date', label: 'Date' },
    { id: 'id', label: 'ID' },
    { id: 'location', label: 'Location' },
    { id: 'time', label: 'Time' },
    { id: 'topic', label: 'Topic' },
    { id: 'complete', label: 'Complete' }, // New 'Complete' column
  ];

  const handleSortChange = (columnId) => {
    const isAsc = sortBy === columnId && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(columnId);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleRowClick = (row) => {
    console.log(row);
  };

  return (
    <Box p="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography variant="h2">Time Table</Typography>
      </Box>
      <Divider />
      <TableComponent
        columns={columns}
        tableHeader={`${getUserDetails().program} Schedule`}
        data={schedules}
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
  );
};

export default TimeTable;
