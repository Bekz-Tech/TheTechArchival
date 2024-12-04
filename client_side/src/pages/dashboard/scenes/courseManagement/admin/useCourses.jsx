import { useState, useEffect } from 'react';
import { updateCourseCurriculum } from "../../../../../firebase/utils";
import useApi from '../../../../../hooks/useApi';
import useWebSocket from '../../../../../hooks/useWebocket';
import { useDispatch, useSelector } from 'react-redux';
import {setAllCourses} from '../../../../../reduxStore/slices/adminDataSlice'
import { endpoints } from '../../../../../utils/constants';


const useCourses = () => {
  const actionToSend = { action: 'watch courses' };

  // Use the centralized useWebSocket hook, passing both URL and actionToSend
  useWebSocket(actionToSend)

  const [formValues, setFormValues] = useState({
    courseName: '',
    courseDescription: '',
    duration: '',
    startDate: '',
    cost: '',
    curriculum: []
  });
  
  const [courses, setCourses] = useState([]);
  const [addCourseModalOpen, setAddCourseModalOpen] = useState(false);
  const [cohortAddModalOpen, setCohortAddModalOpen] = useState(false);  // Separate state for Cohort Add Modal
  const [updateCurriculumModalOpen, setUpdateCurriculumModalOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [addMessageModal, setAddMessageModal] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { loading, data, error, callApi } = useApi(endpoints.COURSES);
  const allCourses = useSelector((state) => state.adminData.allCourses);
  const dispatch = useDispatch();

  useEffect(() => {
    if (allCourses) {
      setCourses(allCourses);
    }
  }, [allCourses]);  // Only runs when `allCourses` changes
  
  useEffect(() => {
    callApi();
    console.log('hello')
  }, []);

  useEffect(() => {
    if (!loading && data) {
      console.log('Data received:', data);
      dispatch(setAllCourses(data));
      setCourses(data.courses);
    }
  }, [loading, data]); 

  // Handle course form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle curriculum field changes
  const handleCurriculumChange = (index, field, value) => {
    const newCurriculum = [...formValues.curriculum];
    newCurriculum[index] = { ...newCurriculum[index], [field]: value };
    setFormValues(prev => ({
      ...prev,
      curriculum: newCurriculum
    }));
  };

  // Add new course
  const handleAddCourse = async () => {
    setAddMessageModal(true);

    const { courseName, courseDescription, duration, startDate, cost } = formValues;

    if (
      courseName.trim() === '' ||
      courseDescription.trim() === '' ||
      duration.trim() === '' ||
      startDate.trim() === '' ||
      cost.trim() === ''
    )
      return;

    const courseData = {
      courseName,
      description: courseDescription,
      duration,
      startDate,
      cost: parseFloat(cost),
    };

    try {
      const courseId = await callApi("POST", courseData);

      const updatedCourses = [...courses, { id: courseId, ...courseData }];
      setCourses(updatedCourses);
      sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));

      setFormValues({
        courseName: '',
        courseDescription: '',
        duration: '',
        startDate: '',
        cost: '',
        curriculum: []
      });
      setAddCourseModalOpen(false);
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  // Update course curriculum
  const handleUpdateCurriculum = async () => {
    try {
      await updateCourseCurriculum(currentCourseId, formValues.curriculum);

      const updatedCourses = courses.map(course =>
        course.id === currentCourseId ? { ...course, curriculum: formValues.curriculum } : course
      );
      setCourses(updatedCourses);
      sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));

      setFormValues({
        courseName: '',
        courseDescription: '',
        duration: '',
        startDate: '',
        cost: '',
        curriculum: []
      });
      setUpdateCurriculumModalOpen(false);
    } catch (error) {
      console.error('Error updating curriculum:', error);
    }
  };

  // Delete a course
  const handleDeleteCourse = (id) => {
    try {
      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      sessionStorage.setItem('btech_courses', JSON.stringify(updatedCourses));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  // Open curriculum update modal
  const handleAddCurriculum = (id) => {
    setCurrentCourseId(id);
    const course = courses.find(c => c.id === id);
    if (course && course.curriculum && course.curriculum.length > 0) {
      setFormValues({ ...formValues, curriculum: course.curriculum });
    } else {
      setFormValues({ ...formValues, curriculum: [] });
    }
    setUpdateCurriculumModalOpen(true);
  };

  // Add a new curriculum field
  const addCurriculumField = () => {
    setFormValues(prevValues => ({
      ...prevValues,
      curriculum: [...prevValues.curriculum, { topic: '', overview: '', week: '', isCompleted: false }]
    }));
  };

  // Remove a curriculum field
  const removeCurriculumField = (index) => {
    setFormValues(prevValues => ({
      ...prevValues,
      curriculum: prevValues.curriculum.filter((_, i) => i !== index)
    }));
  };

  // Open add course modal
  const openAddCourseModal = () => {
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
    setAddCourseModalOpen(true);
  };

  // Close add course modal
  const closeAddCourseModal = () => {
    setAddCourseModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  };

  // Open cohort add modal
  const openCohortAddModal = () => {
    console.log('hello')
    setCohortAddModalOpen(true);  // Set cohort modal to true
  };
  console.log(cohortAddModalOpen);

  // Close cohort add modal
  const closeCohortAddModal = () => {
    setCohortAddModalOpen(false);  // Set cohort modal to false
  };

  // Close curriculum update modal
  const closeUpdateCurriculumModal = () => {
    setUpdateCurriculumModalOpen(false);
    setFormValues({
      courseName: '',
      courseDescription: '',
      duration: '',
      startDate: '',
      cost: '',
      curriculum: []
    });
  };

  // Open course details modal
  const openCourseDetailsModal = (course) => {
    setSelectedCourse(course);
  };

  // Close course details modal
  const closeCourseDetailsModal = () => {
    setSelectedCourse(null);
  };

  // Close message modal
  const closeAddMessageModal = () => {
    setAddMessageModal(false);
  };

  return {
    courses,
    formValues,
    addCourseModalOpen,
    cohortAddModalOpen,  // Pass this to the UI
    updateCurriculumModalOpen,
    selectedCourse,
    addMessageModal,
    message,
    handleChange,
    handleCurriculumChange,
    handleAddCourse,
    handleUpdateCurriculum,
    handleDeleteCourse,
    handleAddCurriculum,
    addCurriculumField,
    removeCurriculumField,
    openAddCourseModal,
    closeAddCourseModal,
    openCohortAddModal,  // Provide open/close methods
    closeCohortAddModal,
    closeUpdateCurriculumModal,
    openCourseDetailsModal,
    closeCourseDetailsModal,
    closeAddMessageModal
  };
};

export default useCourses;
