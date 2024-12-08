import React from 'react';
import {
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';
import useCourses from './useCourses';
import useApi from '../../../../../hooks/useApi';
import { useState } from 'react';
import { endpoints } from '../../../../../utils/constants';
 


const AddCurriculumModal = ({ courseId }) => {

  const { handleCurriculumChange } = useCourses();
  const [resources, setResources] = useState(''); // State for resources input
  const { loading, data, error, callApi } = useApi();


  // Handle resources input change
  const handleResourcesChange = (event) => {
    setResources(event.target.value);
  };

  // Submit function to handle adding curriculum
  const handleSubmit = () => {
    const resourcesArray = resources.split(',').map(resource => resource.trim()); // Convert the string to an array
    const curriculumData = {
      topic: 'Sample Topic', // Use state values or inputs as necessary
      description: 'Sample Description', 
      duration: '1 Week',
      courseId: courseId,
      resources: resourcesArray, // Send resources as an array
    };

    callApi(endpoints.CURRICULUM, "POST", curriculumData, {});
    console.log(curriculumData); // Here you would typically call an API to send data to the backend
  };

  return (
    <Box>
      
      <TextField
        label="Topic"
        name="topic"
        onChange={handleCurriculumChange} // Assuming this function updates the state for topic
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Description"
        name="description"
        onChange={handleCurriculumChange} // Assuming this function updates the state for description
        fullWidth
        margin="normal"
      />
      
      <TextField
        label="Duration"
        name="duration"
        onChange={handleCurriculumChange} // Assuming this function updates the state for duration
        fullWidth
        margin="normal"
      />
      
      {/* New Resources field */}
      <TextField
        label="Resources (comma separated links)"
        name="resources"
        value={resources}
        onChange={handleResourcesChange} // Update resources state on change
        fullWidth
        margin="normal"
      />

      <Button
        onClick={handleSubmit} // On submit, send the data with resources array
        variant="contained"
        color="primary"
      >
        Add Curriculum
      </Button>
    </Box>
  );
};


const AddCourseModal = () => {

    const {
      formValues,
      handleChange,
      handleAddCourse,
    } = useCourses();

    return(
        <Box>
           <TextField
          label="Course Name"
          name="courseName"
          value={formValues.courseName}
          onChange={handleChange}
        />
        <TextField
          label="Course Description"
          name="courseDescription"
          value={formValues.courseDescription}
          onChange={handleChange}
        />
        <TextField
          label="Duration"
          name="duration"
          value={formValues.duration}
          onChange={handleChange}
        />
        <TextField
          label="Start Date"
          name="startDate"
          value={formValues.startDate}
          onChange={handleChange}
        />
        <TextField
          label="Cost"
          name="cost"
          value={formValues.cost}
          onChange={handleChange}
        />
        <Button onClick={handleAddCourse} variant="contained" color="primary">
          Add Course
        </Button>
        </Box>
    )
};

const AddCohortModal = ({ courseId }) => {
  const urlId = courseId;
  console.log(typeof courseId);
  const [cohortName, setCohortName] = useState('');
  const { closeAddCohortModal } = useCourses();
  const { loading, data, error, callApi } = useApi();

  // Handle input change for the cohort name
  const handleChange = (event) => {
    setCohortName(event.target.value);
  };

  // API call to create a new cohort
  const handleSubmit = async (courseId) => {
    const body = {
      name: cohortName

    }
    await callApi(`http://localhost:3500/api/v1/${urlId}/cohorts`, "POST", body, {});  };

  return (
    <Box>
      <TextField
        label="Cohort Name"
        name="cohortName"
        value={cohortName}
        onChange={handleChange}
      />
      <Button onClick={handleSubmit} variant="contained" color="primary">
        Add Cohort
      </Button>
    </Box>
  );
};



const COurseDetailsModal = ({selectedCourse, userRole, openAddCurriculumModal, openCohortAddModal,}) => {
  return (
    <Box>
    <Typography variant="h6">Course Name</Typography>
    <Typography>{selectedCourse.courseName}</Typography>

    <Typography variant="h6">Description</Typography>
    <Typography>{selectedCourse.description}</Typography>

    <Typography variant="h6">Duration</Typography>
    <Typography>{selectedCourse.duration}</Typography>

    <Typography variant="h6">Start Date</Typography>
    <Typography>{new Date(selectedCourse.startDate).toLocaleDateString()}</Typography>

    <Typography variant="h6">Cost</Typography>
    <Typography>{selectedCourse.cost}</Typography>

    {/* <Typography variant="h6">Cohorts</Typography>
    {selectedCourse.cohorts.length > 0 ? (
      selectedCourse.cohorts.map((cohort, index) => (
        <Typography key={index}>Cohort {index + 1}</Typography>
      ))
    ) : (
      <Typography>No Cohorts available</Typography>
    )} */}

    {/* <Typography variant="h6">Curriculum</Typography>
    {selectedCourse.curriculum.length > 0 ? (
      selectedCourse.curriculum.map((curriculumItem, index) => (
        <Box key={index} mb={2}>
          <Typography variant="body1">Week {curriculumItem.week}: {curriculumItem.topic}</Typography>
          <Typography variant="body2">{curriculumItem.overview}</Typography>
        </Box>
      ))
    ) : (
      <Typography>No Curriculum available</Typography>
    )} */}

    {userRole === "admin" || userRole === "superadmin" && (
      <div>
        <Button variant="contained" color="primary" onClick={openCohortAddModal}>
          Add Cohort
        </Button>
        <Button onClick={openAddCurriculumModal} variant="contained" color="primary">
        Add Curriculum
      </Button>
      </div>
    )}
  </Box>
  )
}

const CurriculumList = () => {
  const [curriculums, setCurriculums] = useState([]);

  // Fetch all curriculums from the API
  const fetchCurriculums = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/curriculums'); // Update the API endpoint as needed
      setCurriculums(response.data); // Assuming the response contains an array of curriculum objects
    } catch (error) {
      console.error('Error fetching curriculums:', error);
    }
  };

  useEffect(() => {
    fetchCurriculums(); // Fetch curricula on component mount
  }, []);

  // Handler for editing a curriculum
  const handleEdit = (curriculumId) => {
    console.log('Edit curriculum with ID:', curriculumId);
    // Implement the edit functionality, e.g., opening an edit modal
  };

  // Handler for deleting a curriculum
  const handleDelete = async (curriculumId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/curriculums/${curriculumId}`);
      setCurriculums(curriculums.filter((curriculum) => curriculum.id !== curriculumId));
      console.log('Deleted curriculum with ID:', curriculumId);
    } catch (error) {
      console.error('Error deleting curriculum:', error);
    }
  };

  return (
    <Stack spacing={2} mt={4}>
      {curriculums.length > 0 ? (
        curriculums.map((curriculum) => (
          <Paper key={curriculum.id} elevation={3} style={{ padding: '16px' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" gutterBottom>{curriculum.topic}</Typography>
              <Box>
                {/* Edit Button */}
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(curriculum.id)}
                >
                  <EditIcon />
                </IconButton>

                {/* Delete Button */}
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(curriculum.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>

            <Typography variant="body1" gutterBottom><strong>Description:</strong> {curriculum.description}</Typography>
            <Typography variant="body1" gutterBottom><strong>Duration:</strong> {curriculum.duration}</Typography>
            <Typography variant="body1" gutterBottom><strong>Resources:</strong> {curriculum.resources.join(', ')}</Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="h6">No curriculums available.</Typography>
      )}
    </Stack>
  );
};






export {AddCurriculumModal,
        AddCourseModal,
        AddCohortModal,
        COurseDetailsModal,
        CurriculumList
};