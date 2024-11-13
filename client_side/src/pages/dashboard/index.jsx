import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import FinancialManagement from "./scenes/financialManagement";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Enquiries from "./scenes/enquiries/enquiries";
import UserManagement from "./scenes/userManagement";
import ContentManagement from "./scenes/contentManagement";
import CourseManagement from "./scenes/courseManagement";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import "./index.css";
import { fetchAndStoreUsers } from "../../firebase/utils";
import Feedbacks from "./scenes/feebacks";
import Support from "./scenes/support";
import TimeTable from "./scenes/timeTable";
import Assignment from "./scenes/assignments";
import LearningPlan from "./scenes/learningPlan";
import StudentProgress from "./scenes/studentProgess";
import Curriculum from "./scenes/curriculum";
import StudentPayment from "./scenes/studentPayment";
import InstructorReviews from "./scenes/instructorReviews";
import StudentManagement from "./scenes/studentManagement/studentManagement";
import { tokens } from "./theme";
import OfflineStudentTable from "./scenes/offlineStudent/offlineStudent";
import ChatComponent from "./components/chatComponent";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import FloatingMessageIcon from "./components/floatingMessageIcon";


function DashboardHome() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [userData, setUserData] = useState(null);
  const colors = tokens(theme.palette.mode);
  const userRole = useSelector((state) => state.users.user).role
  const navigate = useNavigate();


  const handleMessage = ()  => {
    navigate('/messenger');
  }


  useEffect(() => {
    let isMounted = true;

    const fetchDataAndUpdateStorage = async () => {
      try {
        const users = await fetchAndStoreUsers();
        if (isMounted) {
          setUserData(users);
          const storedUser = JSON.parse(sessionStorage.getItem('btech_user'));
          if (storedUser) {
            setUserRole(storedUser.role);

          }
        }
      } catch (error) {
        console.error('Error fetching and storing users:', error);
      }
    };

    fetchDataAndUpdateStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderRoutesBasedOnRole = (role) => {
    switch (role) {
      case "superadmin":
        return (
          <>
            <Route path="/messenger" element={<ChatComponent />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route
              path="/financialManagement"
              element={<FinancialManagement />}
            />
            <Route path="/messenger" element={<ChatComponent />} />
            <Route path="/form" element={<Form />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/line" element={<Line />} />
            <Route path="/enquiries" element={<Enquiries />} />
            <Route path="/userManagement" element={<UserManagement />} />
            <Route path="/contentManagement" element={<ContentManagement />} />
            <Route path="/courseManagement" element={<CourseManagement />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/support" element={<Support />} />
            <Route path="/offlineStudents" element={<OfflineStudentTable />} />
          </>
        );

      case 'student':
        return (
          <>
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/studentPayment" element={<StudentPayment />} />
          </>
        );

      case 'instructor':
        return (
          <>
            <Route path="/timeTable" element={<TimeTable />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/learningPlan" element={<LearningPlan />} />
            <Route path="/studentProgress" element={<StudentProgress />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/instructorReviews" element={<InstructorReviews />} />
            <Route path="/courseManagement" element={<CourseManagement />} />
            <Route path="/studentManagement" element={<StudentManagement />} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <div style={{display: 'flex'}}>
          <FloatingMessageIcon />

          <Sidebar isSidebar={isSidebar} />
          <Box
            className="content"
            sx={{
              backgroundColor: theme.palette.mode === "light" ? colors.primary[900] : colors.primary[500], // Change background color based on mode
              height: "auto", // Set full height
              padding: "20px", // Add padding
            }}
          >
            <Topbar  userData = {userData}/>
            <Routes>
              <Route path="/" element={<Dashboard userData={userData} />} />
              {userRole && renderRoutesBasedOnRole(userRole)}
            </Routes>
          </Box>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default DashboardHome;
