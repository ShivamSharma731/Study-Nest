import React, { useState } from "react";
import Sidebar from "./components/Sidebar"; // Adjust the path as necessary
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Channels from "./components/Channels/Channels";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import DashBoard from "./components/DashBoard/DashBoard";
import Notes from "./components/Notes/Notes";
import Studygoals from "./components/Study Goals/Studygoals";
import Askai from "./components/Ask Ai/Askai";
import News from "./components/News/News";
import Solostudy from "./components/Solo Study/Solostudy";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import { ToastContainer, toast } from "react-toastify";
import VerifyOtp from "./components/VerifyOtp";
import StudyRooms from "./components/Study Rooms/StudyRooms";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showText, setShowText] = useState(false);

  const handleMouseEnter = () => {
    setSidebarOpen(true);
    setTimeout(() => setShowText(true), 300);
  };

  const handleMouseLeave = () => {
    setShowText(false);
    setSidebarOpen(false);
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          {/* Routes that require Sidebar */}
          <Route
            path="/*"
            element={
              <div className="flex">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  showText={showText}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                <div className="flex-1 p-0 bg-gray-950 ml-[0px]">
                  <Routes>
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/solo-study" element={<Solostudy />} />
                    <Route path="/study-room" element={<StudyRooms />} />
                    <Route path="/channels" element={<Channels />} />
                    <Route path="/notes" element={<Notes />} />
                    <Route path="/study-goals" element={<Studygoals />} />
                    <Route path="/ask-ai" element={<Askai />} />
                    <Route path="/news" element={<News />} />
                  </Routes>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;
