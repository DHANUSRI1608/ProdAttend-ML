import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

export default function StockDashboardPage() {
  const [stocks, setStocks] = useState([]);
  const [formData, setFormData] = useState({ material: "", category: "", quantity: "" });
  const [dashboardData, setDashboardData] = useState({
    predicted_completion: 0,
    actual_completion: 0,
  });

  // Fetch stock data
  const fetchData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/stock");
      const data = await res.json();
      setStocks(data);

      const totalQty = data.reduce((acc, item) => acc + item.quantity, 0);
      setDashboardData({
        predicted_completion: totalQty * 2,
        actual_completion: totalQty * 1.6,
      });
    } catch (err) {
      console.error("Error fetching stock data:", err);
    }
  };

  // Add new stock
  const addStock = async (e) => {
    e.preventDefault();
    if (!formData.material || !formData.category || !formData.quantity) {
      alert("Please fill all fields!");
      return;
    }
    try {
      await fetch("http://127.0.0.1:5000/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          material: formData.material,
          category: formData.category,
          quantity: parseInt(formData.quantity, 10),
        }),
      });
      setFormData({ material: "", category: "", quantity: "" });
      fetchData(); // refresh
    } catch (err) {
      console.error("Error adding stock:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const efficiency =
    dashboardData.predicted_completion > 0
      ? (dashboardData.actual_completion / dashboardData.predicted_completion) * 100
      : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        📊 Stock & Production Dashboard
      </h1>

      {/* Stock Input Form */}
      <form
        onSubmit={addStock}
        className="flex flex-wrap gap-4 items-center justify-center bg-white p-4 rounded-lg shadow"
      >
        <input
          type="text"
          placeholder="Material"
          className="border p-2 rounded w-48"
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="border p-2 rounded w-48"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="border p-2 rounded w-32"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Stock
        </button>
      </form>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-600 font-medium">Predicted Completion</h2>
          <p className="text-2xl font-semibold text-blue-600">
            {dashboardData.predicted_completion.toFixed(0)} Units
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-600 font-medium">Actual Completion</h2>
          <p className="text-2xl font-semibold text-green-600">
            {dashboardData.actual_completion.toFixed(0)} Units
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-600 font-medium">Efficiency</h2>
          <p className="text-2xl font-semibold text-purple-600">
            {efficiency.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Material Stock Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stocks}
                dataKey="quantity"
                nameKey="material"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
{stocks.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={COLORS[index % COLORS.length]}
  />
))}              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Predicted vs Actual Production
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Today",
                  Predicted: dashboardData.predicted_completion,
                  Actual: dashboardData.actual_completion,
                },
              ]}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Predicted" fill="#3b82f6" />
              <Bar dataKey="Actual" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div>
        <h3 className="text-2xl font-bold text-center mt-6 mb-4 text-gray-800">
          📦 Real-Time Stock Table
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Material</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Quantity</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length > 0 ? (
                stocks.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <td className="py-2 px-4">{item.id}</td>
                    <td className="py-2 px-4 font-medium">{item.material}</td>
                    <td className="py-2 px-4">{item.category}</td>
                    <td className="py-2 px-4">{item.quantity} units</td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        item.quantity > 50
                          ? "text-green-600"
                          : item.quantity > 20
                          ? "text-yellow-500"
                          : "text-red-600"
                      }`}
                    >
                      {item.quantity > 50
                        ? "Sufficient"
                        : item.quantity > 20
                        ? "Low Stock"
                        : "Critical"}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-500">
                      {new Date(item.last_updated).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-gray-500 italic"
                  >
                    No stock data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}