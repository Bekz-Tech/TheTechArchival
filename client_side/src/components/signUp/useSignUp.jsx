import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useApi from "../../hooks/useApi";
import { endpoints } from "../../utils/constants";

const useSignUp = ({ offline, role }) => {
    const [assignedInstructor, setAssignedInstructor] = useState('');
    const [courseSelected, setCourseSelected] = useState(null);
    const [cohortsOptions, setCohortsOptions] = useState([]); // State to store cohort options
    const [loadingCohorts, setLoadingCohorts] = useState(false); // Loading state for cohorts
    const [error, setError] = useState('');
    const { data, loading, error: submitError, callApi } = useApi();

    const courses = useSelector((state) => state.adminData.courses.courses);
    const users = useSelector((state) => state.adminData.usersData);

    const instructors = users.instructors || [];
    const programs = Array.isArray(courses) ? courses.map(course => course.courseName) : [];

    const roleFields = {
        student: [
            { label: 'First Name', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
            { label: 'Profile Picture', name: 'profilePictureUrl', type: 'file', required: true }, // Make it required
            { label: 'Program', name: 'program', type: 'select', required: true, options: programs },
            { label: 'Cohort', name: 'cohort', type: 'select', required: !offline, options: cohortsOptions }, // Cohort options
            { label: 'Assign Instructor', name: 'assignedInstructor', type: 'text', required: true },
            { label: 'Emergency Contact Name', name: 'emergencyContactName', type: 'text', required: true },
            { label: 'Emergency Contact Relationship', name: 'emergencyContactRelationship', type: 'text', required: true },
            { label: 'Emergency Contact Phone', name: 'emergencyContactPhone', type: 'tel', required: true },
            { label: 'Amount Paid', name: 'amountPaid', type: 'number', required: true },
        ],
        instructor: [
            { label: 'First Name', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
            { label: 'Profile Picture', name: 'profilePictureUrl', type: 'file', required: true }, // Make it required
            { label: 'Program', name: 'program', type: 'select', required: true, options: programs },
            { label: 'Cohort', name: 'cohort', type: 'select', required: !offline, options: cohortsOptions }, // Cohort options
        ],
        admin: [
            { label: 'First Name', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
            { label: 'Profile Picture', name: 'profilePictureUrl', type: 'file', required: true }, // Make it required
        ]
    };

    const getInitialFormData = (role) => {
        const initialData = {};
        if (roleFields[role]) {
            roleFields[role].forEach(field => {
                initialData[field.name] = field.name === 'program' ? '' : (field.type === 'number' ? 0 : '');
            });
        }
        return initialData;
    };

    const [formData, setFormData] = useState(getInitialFormData(role));
    const [profilePictureUrl, setProfilePictureUrl] = useState(null);
    const formRef = useRef(null);

    // Fetch cohorts based on the selected program (course)
    const fetchCohorts = async (courseId) => {
        try {
            setLoadingCohorts(true);
            const response = await fetch(`http://localhost:3500/api/v1/${courseId}/cohorts`);

            const cohorts = await response.json();
            setCohortsOptions(cohorts.cohorts.map(cohort => cohort.cohortName)); // Set cohort names as options

            if (role === 'student') {
                setInstructor(cohorts.cohorts); // Set instructor only for students
            }
        } catch (error) {
            console.error('Error fetching cohorts:', error);
        } finally {
            setLoadingCohorts(false);
        }
    };

    // Set assigned instructor based on the cohort's instructorId, only for students
    const setInstructor = (cohorts) => {
        if (role === 'student') {
            // Find the instructor based on cohort and assign
            cohorts.forEach(cohort => {
                const instructor = instructors.find(instructor => instructor._id === cohort.instructor);
                console.log(instructor)
                if (instructor) {
                    setAssignedInstructor(`${instructor.firstName} ${instructor.lastName}`);
                }
            });
        }
    };


    useEffect(() => {
        setFormData(getInitialFormData(role));
    }, [role]);

    const handleProgramChange = (e) => {
        const { value } = e.target;
        const selectedCourse = courses.find(course => course.courseName === value);
        
        if (selectedCourse) {
            setCourseSelected(selectedCourse);
            setFormData(prevData => ({
                ...prevData,
                program: value
            }));
    
            fetchCohorts(selectedCourse.courseId); // Fetch cohorts for the selected course
        }
    };

    const handleCohortChange = (e) => {
        const { value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            cohort: value
        }));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
    
        if (name === 'profilePictureUrl') {
            const selectedFile = files[0]; // Store the selected file
            setProfilePictureUrl(selectedFile);
            console.log(selectedFile); // Log the selected file directly
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
      
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
      
        if (!profilePictureUrl) {
            setError('Profile Picture is required');
            return;
        }
      
        try {
            // Prepare FormData to handle both text and file data
            const formDataToSubmit = new FormData();
      
            // Add all form fields to FormData, except confirmPassword and profilePicture
            Object.keys(formData).forEach((key) => {
                if (key !== 'confirmPassword' && key !== 'profilePictureUrl') {
                    formDataToSubmit.append(key, formData[key]);
                }
            });
      
            // Append role, profilePicture, and assignedInstructor (conditionally for students)
            formDataToSubmit.append('role', role);
            formDataToSubmit.append('profilePictureUrl', profilePictureUrl);  // Ensure it's only appended once
      
            if (role === 'student') {
                formDataToSubmit.append('assignedInstructor', assignedInstructor);
            }
      
            // Call the API using your custom hook
            await callApi(endpoints.USER, 'POST', formDataToSubmit, '', {
                'Content-Type': 'multipart/form-data',  // Important for file upload
            });
      
            alert('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user');
        }
    };
    
    

    return {
        roleFields,
        formData,
        error,
        loading,
        profilePictureUrl,
        instructors,
        handleSubmit,
        handleProgramChange,
        handleChange,
        handleCohortChange,
        loadingCohorts,
        assignedInstructor,
    };
};

export default useSignUp;
