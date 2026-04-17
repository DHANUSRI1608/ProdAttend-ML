import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Attendance from "./pages/Attendance";
import AttendanceList from "./pages/AttendanceList";
import Dashboard from "./pages/Dashboard";
import WelcomeHero from "./WelcomeHero";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          <Routes>
            <Route path="/" element={<WelcomeHero />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance-list" element={<AttendanceList/>} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
