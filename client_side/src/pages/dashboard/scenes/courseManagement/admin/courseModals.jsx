import React from 'react';
import {
  Button,
  TextField,
  Box
} from '@mui/material';
import useCourses from './useCourses';
import useApi from '../../../../../hooks/useApi';
import { useState } from 'react';
 


const AddCurriculumModal = () => {

  const {handleCurriculumChange} = useCourses();

    return(
        <Box>
              <TextField
          label="Topic"
          name="topic"
          onChange={handleCurriculumChange}
        />
        <TextField
          label="Overview"
          name="overview"
          onChange={handleCurriculumChange}
        />
        <TextField
          label="Week"
          name="week"
          onChange={handleCurriculumChange}
        />
        <Button onClick={() => {console.log('waitimg')}} variant="contained" color="primary">
          Add Curriculum
        </Button>
        </Box>
    )
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
  console.log(courseId)
  const [cohortName, setCohortName] = useState('');
  const { closeAddCohortModal } = useCourses();
  const { loading, data, error, callApi } = useApi(`http://localhost:5000/api/v1/${courseId}/cohorts`);

  // Handle input change for the cohort name
  const handleChange = (event) => {
    setCohortName(event.target.value);
  };

  // API call to create a new cohort
  const handleSubmit = async () => {
    const body = {
      name: cohortName

    }
    callApi("POST", body, {});
  };

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






export {AddCurriculumModal,
        AddCourseModal,
        AddCohortModal
};