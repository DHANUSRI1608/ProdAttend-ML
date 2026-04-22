<<<<<<< HEAD
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";

import Attendance from "./pages/Attendance";
import AttendanceList from "./pages/AttendanceList";
import PredictionDashboard from "./pages/PredictionDashboard";
import StockManagement from "./pages/StockManagement";
import WelcomeHero from "./WelcomeHero";
import { Menu } from "lucide-react"; // Icon for mobile toggle

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* 📱 Mobile Navbar */}
      <div className="md:hidden flex items-center justify-between bg-blue-600 text-white px-4 py-3 shadow">
        <h1 className="text-lg font-semibold">Workforce Dashboard</h1>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-blue-700 transition"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🧭 Sidebar (responsive) */}
      <div
        className={`fixed md:static top-0 left-0 h-full z-20 bg-white shadow-md transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:flex`}
      >
        <Sidebar />
      </div>

      {/* 🏗️ Main Content Area */}
      <div className="flex-1 p-4 md:p-6 bg-gray-100 overflow-auto">
        <Routes>
          <Route path="/" element={<WelcomeHero />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/attendance-list" element={<AttendanceList />} />
          <Route path="/PredictionDashboard" element={<PredictionDashboard />} />
          <Route path="/StockManagement" element={<StockManagement />} />
        </Routes>
      </div>

      {/* 📱 Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
=======
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
>>>>>>> 50af2e90bc3d72865ed125cb69ceed1dc638c5c3
  );
}
