import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages';
import SignInPage from './pages/signin';
import ChatbotComponent from './components/chatbot';
import Testimonials from './components/Testimonials';
import DashboardHome from './pages/dashboard';
import Loader from './utils/loader';
import CodeAuthenticator from './generateCode/codeAuthenticator';
import OfflineSignUp from './pages/offlineSignUp';
import VideoCall from './pages/VideoCalls';

function MyRoute() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/chatbot" element={<ChatbotComponent />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/dashboard/*" element={<DashboardHome />} />
        <Route path="/code-authenticator" element={<CodeAuthenticator />} />
        <Route path="/offlineSignup" element={<OfflineSignUp />} />
        <Route path="/videoCall" element={<VideoCall />} />
      </Routes>
    </Router>
  );
}

export default MyRoute;
