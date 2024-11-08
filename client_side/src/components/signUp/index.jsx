import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Typography, Alert, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { handleSignUp, fetchCourses, fetchAndStoreUsers} from '../../firebase/utils';
import { updateDoc, getDoc, doc} from 'firebase/firestore';
import { db } from '../../firebase/config'; // Import your Firestore config

const SignUpForm = ({ role, offline }) => {
    const [instructorOptions, setInstructorOptions] = useState([]);
    const [coursesOptions, setCoursesOptions] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesData = await fetchCourses();  // Ensure fetchCourses resolves
                const usersData = await fetchAndStoreUsers();  // Ensure fetchAndStoreUsers resolves

                setCourses(coursesData);
                setUsers(usersData);  // This sets the state with the actual resolved data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();  // Call the async function to fetch data
    }, []);


    // Ensure users is an array before filtering
    const instructors = Array.isArray(users) ? users.filter(user => user.role === 'instructor') : [];
    const programs = Array.isArray(courses) ? courses.map(course => course.courseName) : [];

    const roleFields = {
        student: [
            { label: 'First Name', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
            { label: 'Profile Picture', name: 'profilePicture', type: 'file', required: false },
            { label: 'Program', name: 'program', type: 'select', required: true, options: programs },
            { label: 'Assign Instructor', name: 'assignedInstructor', type: 'select', required: true, options: instructorOptions },
            { label: 'Emergency Contact Name', name: 'emergencyContactName', type: 'text', required: true },
            { label: 'Emergency Contact Relationship', name: 'emergencyContactRelationship', type: 'text', required: true },
            { label: 'Emergency Contact Phone', name: 'emergencyContactPhone', type: 'tel', required: true },
            { label: 'Amount Paid', name: 'amountPaid', type: 'number', required: true },
            { label: 'Cohort', name: 'cohort', type: !offline ? 'select' : "text", required: !offline ? true : false, options: !offline ? programs : '' }
        ],
        instructor: [
            { label: 'First Name', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
            { label: 'Profile Picture', name: 'profilePicture', type: 'file', required: false },
            { label: 'Program', name: 'program', type: 'select', required: true, options: programs },
        ],
        admin: [
            { label: 'First Name', name: 'firstName', type: 'text', required: true },
            { label: 'Last Name', name: 'lastName', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone Number', name: 'phoneNumber', type: 'tel', required: true },
            { label: 'Password', name: 'password', type: 'password', required: true },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password', required: true },
            { label: 'Profile Picture', name: 'profilePicture', type: 'file', required: false },
        ]
    };

    const getInitialFormData = (role) => {
        const initialData = {};
        if (roleFields[role]) {
            roleFields[role].forEach(field => {
                
                initialData[field.name] = field.name === 'program' ? '' : (field.type === 'number' ?  0 : '');
            });
            
        }
        return initialData;
    };

    const [formData, setFormData] = useState(getInitialFormData(role));
    const [error, setError] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        setFormData(getInitialFormData(role));

        if (role === 'student') {
            filterInstructors(formData.program);
        }
    }, [role]);

    // Fetch courses for the selected program
    const fetchInstructorCourses = (program) => {
        try {
            const allCourses = JSON.parse(sessionStorage.getItem('btech_courses')) || [];
            console.log(allCourses)
            const instructorCourses = allCourses.filter(course => course.courseName === program);
            setCoursesOptions(instructorCourses);
            console.log(coursesOptions)
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    //get instrcutor for selected program
    const filterInstructors = (program) => {
        if (role === 'student') {
            const filteredInstructor = instructors.filter(instructor =>
                instructor.programsAssigned && instructor.programsAssigned.includes(program)
            );
            const instructorName =  filteredInstructor.map((instrcutor) => `${instrcutor.firstName} ${instrcutor.lastName}`)
            setInstructorOptions(instructorName);
            console.log(instructors);
        }
    };


    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (name === 'profilePicture') {
            setProfilePicture(files[0]);
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
            if (name === 'program' && role === 'instructor') {
                fetchInstructorCourses(value); // Fetch courses based on selected program
            }
            if (name === 'program' && role === 'student') {
                filterInstructors(value); // Filter instructors based on selected program
            }
        }
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            let downloadURL = '';

            // Upload the profile picture if it exists
            if (profilePicture) {
                const storage = getStorage();
                const storageRef = ref(storage, `profile_pictures/${profilePicture.name}`);
                const uploadTask = uploadBytesResumable(storageRef, profilePicture);

                await new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        null,
                        reject,
                        async () => {
                            try {
                                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve();
                            } catch (urlError) {
                                reject(urlError);
                            }
                        }
                    );
                });
            }

             // Get the instructor data from Firestore using name
             const selectedInstructorName = formData.assignedInstructor;
             const selectedInstructor = instructors.find(instructor =>
                 `${instructor.firstName} ${instructor.lastName}` === selectedInstructorName
             );

            // Fetch instructor and course details if role is student
            let assignedInstructorData = {};

            if (role === 'student') {
                if (selectedInstructor) {
                    const instructorDoc = await getDoc(doc(db, 'users', selectedInstructor.userId));
                    assignedInstructorData = instructorDoc.exists() ? instructorDoc.data() : {};
                }

            }

            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
                profilePictureUrl: downloadURL || '',
                ...(role === 'student' && formData.program && {
                    program: formData.program,
                    assignedInstructor: assignedInstructorData,
                }),
                ...(role === 'student' && formData.amountPaid && {
                    amountPaid: formData.amountPaid
                }),
                ...(role === 'student' && {
                    emergencyContactName: formData.emergencyContactName || '',
                    emergencyContactRelationship: formData.emergencyContactRelationship || '',
                    emergencyContactPhone: formData.emergencyContactPhone || ''
                }),
                ...(role === 'instructor' && formData.program && {
                    programsAssigned: [formData.program],
                    studentsAssigned: [],
                    averageRating: 0,
                }),
            };

            const allCourses = JSON.parse(sessionStorage.getItem('btech_courses')) || [];
            const studentCourses = allCourses.filter(course => course.courseName === userData.program);
            const userCourse = role === "student" ? studentCourses : coursesOptions;

            // Sign up the user with Firebase Auth and store user data in Firestore
            let newUserRef = ''
             if (!offline) {
                newUserRef = await handleSignUp(userData, role, profilePicture, userCourse, '', false)
            }
            
            if (offline) {
                newUserRef = await handleSignUp(userData, role, profilePicture, userCourse, '', true);
            }

            // If a student is assigned to an instructor, update the instructor's document
            if (role === 'student' && formData.assignedInstructor) {
                const instructorRef = doc(db, 'users', selectedInstructor.userId);
                await updateDoc(instructorRef, {
                    studentsAssigned: [...assignedInstructorData.studentsAssigned, newUserRef]
                });
            }

            // Reset the form after successful submission
            setFormData(getInitialFormData(role));
            formRef.current.reset();
            setProfilePicture(null);
        } catch (error) {
            console.error('Error creating user:', error);
            setError('Failed to create user');
        }
    };

    
    

    return (
      <Box>
        <Typography variant="h4">
          Sign Up ({role.charAt(0).toUpperCase() + role.slice(1)})
        </Typography>
        <form onSubmit={handleSubmit} ref={formRef}>
          {roleFields[role]?.map((field, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              {field.type === "select" ? (
                <FormControl fullWidth>
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    {field.options?.map((option, idx) => (
                      <MenuItem key={idx} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                field.label !== "Cohort" && (
                  <TextField
                    fullWidth
                    label={field.label}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]} // Value from formData if it's not Cohort
                    onChange={handleChange}
                    required={field.required}
                    InputLabelProps={
                      field.type === "file" ? { shrink: true } : {}
                    }
                    InputProps={
                      field.type === "file"
                        ? { inputProps: { accept: "image/*" } }
                        : {}
                    }
                  />
                )
              )}
            </Box>
          ))}
          {error && <Alert severity="error">{error}</Alert>}
          <Button type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </form>
      </Box>
    );
};

export default SignUpForm;