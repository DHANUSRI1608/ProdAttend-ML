import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle } from "lucide-react";

export default function AttendanceList() {
  const [employees, setEmployees] = useState([]);

  const fetchData = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/attendance");
    const json = await res.json();
    setEmployees(json);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white flex flex-col items-center py-10 px-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex items-center gap-3 mb-10"
      >
        <Users size={36} className="text-emerald-300" />
        <h1 className="text-4xl font-extrabold tracking-wide">
          Real-Time Attendance List
        </h1>
      </motion.div>

      {/* Table Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
      >
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gradient-to-r from-indigo-600/70 to-purple-700/70">
            <tr>
              <th className="py-3 px-6 font-semibold uppercase tracking-wide text-gray-100">
                ID
              </th>
              <th className="py-3 px-6 font-semibold uppercase tracking-wide text-gray-100">
                Name
              </th>
              <th className="py-3 px-6 font-semibold uppercase tracking-wide text-gray-100">
                Age
              </th>
              <th className="py-3 px-6 font-semibold uppercase tracking-wide text-gray-100">
                Department
              </th>
              <th className="py-3 px-6 font-semibold uppercase tracking-wide text-gray-100">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/10 hover:bg-white/10 transition-all"
              >
                <td className="py-3 px-6">{emp.id}</td>
                <td className="py-3 px-6 font-medium text-emerald-200">
                  {emp.name}
                </td>
                <td className="py-3 px-6">{emp.age}</td>
                <td className="py-3 px-6">{emp.department}</td>
                <td className="py-3 px-6">
                  {emp.working ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle size={18} /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                      <XCircle size={18} /> Absent
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Footer Note */}
      <p className="mt-6 text-gray-400 text-xs italic">
        🔄 Auto-refreshes every 3 seconds with real-time data.
      </p>
    </div>
  );
}
