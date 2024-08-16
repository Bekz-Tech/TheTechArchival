import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import SignInPage from './pages/signin';
import ChatbotComponent from './components/chatbot';
import Testimonials from './components/Testimonials';
import DashboardHome from './pages/dashboard';

function MyRoute() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/chatbot" element={<ChatbotComponent />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/dashboard/*" element={<DashboardHome />} />
        </Routes>
      </Router>
  );
}

export default MyRoute;
