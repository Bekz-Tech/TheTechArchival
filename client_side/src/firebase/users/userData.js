export const instructorUser = {
  userId: 'instructorUserId1',
  email: 'instructor@example.com',
  password: 'password123',
  name: 'Instructor User',
  role: 'instructor',
  createdAt: new Date(),
  updatedAt: new Date(),
  hiredDate: new Date(),
  courses: [
    {
      courseId: 'course1',
      courseName: 'Introduction to Programming',
      startDate: new Date(),
      endDate: new Date(),
    },
  ],
  students: [
    {
      studentId: 'studentUserId1',
      studentName: 'Student User',
      courseId: 'course1',
    },
  ],
  performance: {
    coursesTaught: 1,
    studentsTaught: 1,
    averageRating: 4.5,
  },
  messages: [
    {
      studentId: 'studentUserId1',
      messages: [
        {
          sender: 'student',
          message: 'I have a question about the assignment.',
          timestamp: new Date(),
        },
        {
          sender: 'instructor',
          message: 'Sure, what is your question?',
          timestamp: new Date(),
        },
      ],
    },
  ],
};

export const studentUser = {
  userId: 'studentUserId2',
  email: 'student2@example.com',
  password: 'password123',
  name: 'Student User',
  role: 'student',
  createdAt: new Date(),
  updatedAt: new Date(),
  enrollmentDate: new Date(),
  courses: [
    {
      courseId: 'course1',
      courseName: 'Introduction to Programming',
      enrollmentDate: new Date(),
    },
  ],
  assignments: [
    {
      assignmentId: 'assignment1',
      assignmentName: 'JavaScript Basics',
      status: 'completed',
      submissionDate: new Date(),
    },
  ],
  progress: {
    completedCourses: 1,
    ongoingCourses: 0,
    assignmentsCompleted: 1,
    overallGrade: 'A',
  },
  messages: [
    {
      instructorId: 'instructor1',
      messages: [
        {
          sender: 'student',
          message: 'I have a question about the assignment.',
          timestamp: new Date(),
        },
        {
          sender: 'instructor',
          message: 'Sure, what is your question?',
          timestamp: new Date(),
        },
      ],
    },
  ],
};

export const adminUser = {
  userId: 'adminUserId1',
  email: 'admin@example.com',
  password: 'password123',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const superAdminUser = {
  userId: 'superAdminUserId1',
  email: 'superadmin@example.com',
  password: 'password123',
  name: 'Super Admin User',
  role: 'superadmin',
  createdAt: new Date(),
  updatedAt: new Date(),
};
