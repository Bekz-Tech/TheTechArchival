import React, { useState } from 'react';
import { Button, TextField, Grid, Paper, Typography, Divider, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/Header";


const Admin = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Introduction to Programming' },
    { id: 2, name: 'Web Development Fundamentals' },
    // Add more courses as needed
  ]);

  const handleAddCourse = () => {
    const newCourse = { id: courses.length + 1, name: 'New Course' };
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = courses.filter(course => course.id !== id);
    setCourses(updatedCourses);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
      <Header title="Course Management" subtitle="Manage courses" />

      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Courses
          </Typography>
          <List>
            {courses.map(course => (
              <ListItem key={course.id}>
                <ListItemText primary={course.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteCourse(course.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Add New Course
          </Typography>
          <TextField
            label="Course Name"
            variant="outlined"
            fullWidth
            margin="normal"
            // Implement onChange and value handlers
          />
          <Button variant="contained" color="primary" onClick={handleAddCourse}>
            Add Course
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Admin;
