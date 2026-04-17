import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, UserPlus, XCircle } from "lucide-react";

export default function AttendanceScan() {
  const [lastScanned, setLastScanned] = useState(null);
  const [status, setStatus] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    age: "",
    department: "",
  });

  // 📷 QR Scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 300 });

    const onScanSuccess = async (scannedText) => {
      try {
        const parsed = JSON.parse(scannedText);
        setLastScanned(parsed);
        setStatus("⏳ Updating attendance...");

        const res = await fetch("http://127.0.0.1:5000/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: parsed.id }),
        });

        const data = await res.json();

        if (data.status === "ok") {
          setStatus(
            `${parsed.name} ${
              data.working ? "checked in ✅" : "checked out ❌"
            } at ${new Date().toLocaleTimeString()}`
          );
          window.dispatchEvent(new Event("attendanceUpdated"));
        } else if (data.status === "unknown_user") {
          setStatus("⚠ User not found. Please register.");
          setShowAddUser(true);
          setNewUser({
            id: parsed.id,
            name: parsed.name || "",
            department: parsed.department || "",
          });
        } else {
          setStatus("⚠ Attendance update failed.");
        }
      } catch (err) {
        console.error("QR parse or network error", err);
        setStatus("❌ Invalid QR or server error.");
      }
    };

    scanner.render(onScanSuccess);
    return () => scanner.clear();
  }, []);

  // 🧍 Register New User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setStatus("⏳ Registering new user...");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/add_employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();

      if (data.status === "created") {
        setStatus("✅ User added successfully!");
        setShowAddUser(false);
        setNewUser({ id: "", name: "", department: "", age: "" });
      } else {
        setStatus("⚠ Failed to add user.");
      }
    } catch (err) {
      console.error("Add user error", err);
      setStatus("❌ Server error while adding user.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-800 text-white py-10 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-8"
      >
        <div className="flex justify-center mb-3">
          <QrCode size={40} className="text-emerald-300" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">
          Employee Attendance Scanner
        </h1>
        <p className="text-slate-300 text-sm">
          Scan QR codes to mark or toggle attendance in real-time.
        </p>
      </motion.div>

      {/* QR Scanner Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl flex flex-col items-center space-y-3"
      >
        <div
          id="qr-reader"
          className="w-[320px] h-[320px] bg-white/5 rounded-lg border border-dashed border-emerald-400"
        ></div>
        <p className="text-slate-200 text-sm italic">
          📸 Align the employee QR code inside the box
        </p>
      </motion.div>

      {/* Scanned Info */}
      <AnimatePresence>
        {lastScanned && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8 p-5 w-[340px] bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg"
          >
            <p className="text-lg font-semibold text-emerald-200">
              👤 {lastScanned.name || "Unknown"} ({lastScanned.department || "N/A"})
            </p>
            <p className="text-sm text-slate-300">ID: {lastScanned.id}</p>
            <p
              className={`mt-3 font-medium text-sm ${
                status.includes("✅")
                  ? "text-green-400"
                  : status.includes("❌")
                  ? "text-red-400"
                  : status.includes("⚠")
                  ? "text-yellow-400"
                  : "text-blue-300"
              }`}
            >
              {status}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Add User */}
      <motion.button
        onClick={() => setShowAddUser(!showAddUser)}
        whileHover={{ scale: 1.05 }}
        className="mt-6 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-2 rounded-full font-semibold text-white shadow-lg transition-all"
      >
        {showAddUser ? (
          <>
            <XCircle size={18} /> Close Form
          </>
        ) : (
          <>
            <UserPlus size={18} /> Add New Employee
          </>
        )}
      </motion.button>

      {/* Add User Form */}
      <AnimatePresence>
        {showAddUser && (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onSubmit={handleAddUser}
            className="mt-6 w-[350px] bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col gap-3"
          >
            <h3 className="text-xl font-bold text-center text-emerald-300 mb-2">
              Register New Employee
            </h3>

            <input
              type="text"
              placeholder="Employee Name"
              value={newUser.name}
              onChange={(e) =>
                setNewUser({ ...newUser, name: e.target.value })
              }
              className="p-2 rounded-md bg-white/20 border border-white/30 focus:ring-2 focus:ring-emerald-400 outline-none placeholder-slate-300 text-white"
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={newUser.age}
              onChange={(e) =>
                setNewUser({ ...newUser, age: e.target.value })
              }
              className="p-2 rounded-md bg-white/20 border border-white/30 focus:ring-2 focus:ring-emerald-400 outline-none placeholder-slate-300 text-white"
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={newUser.department}
              onChange={(e) =>
                setNewUser({ ...newUser, department: e.target.value })
              }
              className="p-2 rounded-md bg-white/20 border border-white/30 focus:ring-2 focus:ring-emerald-400 outline-none placeholder-slate-300 text-white"
              required
            />

            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 py-2 rounded-md font-semibold shadow-md transition-all"
            >
              Add Employee
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
