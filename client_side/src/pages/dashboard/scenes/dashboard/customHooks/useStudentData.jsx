import { useMemo, useState, useEffect } from 'react';
import { getUserDetails } from '../../../../../utils/constants';

const useStudentData = () => {
  const [studentData, setStudentData] = useState({});
  const [timeTable, setTimeTable] = useState([]);

  useEffect(() => {
    const userDetails = getUserDetails();
    setStudentData(userDetails);

    if (userDetails.assignedInstructor) {
      // Get all the timetables from the assigned instructor
      const matchedTimetables = userDetails.assignedInstructor.courses
        .filter(course => course.courseName === userDetails.program) // Match the student's program with instructor's courseName
        .flatMap(course => course.timetable || []); // Collect all the timetables from matched courses

      setTimeTable(matchedTimetables); // Set the matched timetables
    }
  }, []);

  // Check if studentData is available and is an object
  if (!studentData || typeof studentData !== 'object') {
    console.warn('Invalid studentData:', studentData); // Log warning for invalid data
    return {
      completedCourses: [],
      remainingCourses: [],
      progressPercentage: 0,
      timeTable: [],
      attendanceRate: 0, // Default attendance rate
      outstandings: { totalOutstanding: 0, percentageDifference: 0 }, // Default outstandings
      nextClass: null, // Default next class
    };
  }

  // Ensure courses exist and are an array
  const courses = Array.isArray(studentData.courses) ? studentData.courses : [];

  // Using useMemo for performance optimization
  const {
    completedCourses,
    remainingCourses,
    progressPercentage,
    attendanceRate,
    outstandings,
    nextClass,
  } = useMemo(() => {
    const completedCourses = [];
    const remainingCourses = [];

    // Loop through each course
    courses.forEach(course => {
      const { curriculum } = course;

      // Check if curriculum is defined and is an array
      if (Array.isArray(curriculum)) {
        // Loop through each curriculum topic
        curriculum.forEach(topic => {
          if (topic.isCompleted) {
            completedCourses.push(topic);
          } else {
            remainingCourses.push(topic);
          }
        });
      } else {
        console.warn('Curriculum is not an array:', curriculum);
      }
    });

    // Calculate the progress percentage
    const totalTopics = completedCourses.length + remainingCourses.length;
    const progressPercentage = totalTopics > 0
      ? (completedCourses.length / totalTopics) * 100
      : 0;

    // Get the current date and time
    const currentDateTime = new Date();

    // Filter out past timetables
    const pastTimetables = timeTable.filter(timetable => {
      const timetableDateTime = new Date(`${timetable.date}T${timetable.time}`);
      return timetableDateTime < currentDateTime; // Only include past timetables
    });

    // Calculate attendance rate
    const totalTimetables = pastTimetables.length;
    const completedTimetables = pastTimetables.filter(timetable => timetable.done).length;
    const attendanceRate = totalTimetables > 0
      ? (completedTimetables / totalTimetables) * 100
      : 0;

    // Calculate outstandings
    const amountPaid = studentData.amountPaid || 0; // Get amount paid or default to 0
    const totalCost = courses.reduce((acc, course) => {
      const cost = parseInt(course.cost, 10) || 0; // Parse cost and default to 0
      return acc + cost;
    }, 0);

    const totalOutstanding = totalCost - amountPaid; // Calculate total outstanding
    const percentageDifference = totalCost > 0
      ? (totalOutstanding / totalCost) * 100 // Calculate percentage difference
      : 0;

    // Find the next class
    const upcomingClasses = timeTable.filter(timetable => {
      const timetableDateTime = new Date(`${timetable.date}T${timetable.time}`);
      return timetableDateTime > currentDateTime; // Only include upcoming timetables
    });
    

    const nextClass = upcomingClasses.length > 0
      ? upcomingClasses.reduce((earliest, current) => {
          const earliestDateTime = new Date(`${earliest.date}T${earliest.time}`);
          const currentDateTime = new Date(`${current.date}T${current.time}`);
          return currentDateTime < earliestDateTime ? current : earliest;
        })
      : null; // No next class if none found


    return {
      completedCourses,
      remainingCourses,
      progressPercentage,
      attendanceRate,
      outstandings: { totalOutstanding, percentageDifference, amountPaid}, // Return outstandings
      nextClass, // Return next class
    };
  }, [courses, timeTable, studentData]); // Depend on courses, timeTable, and studentData arrays

  console.log('Time Table:', timeTable);
  console.log('Attendance Rate:', attendanceRate);
  console.log('Outstandings:', outstandings);
  console.log('Next Class:', nextClass);

  return {
    completedCourses,
    remainingCourses,
    progressPercentage,
    timeTable, // Return the matched timetables
    attendanceRate, // Return the attendance rate
    outstandings, // Return the outstandings object
    nextClass, // Return the next class
  };
};

export default useStudentData;
