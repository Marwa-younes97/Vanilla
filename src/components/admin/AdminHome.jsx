import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminHome = () => {
  const [dateFilter, setDateFilter] = useState("30days");
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [ordersChartData, setOrdersChartData] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "https://bakeryproject-1onw.onrender.com/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const orders = response.data;
        const now = new Date();
        let filteredOrders = [];

        switch (dateFilter) {
          case "today":
            filteredOrders = orders.filter((order) => {
              const orderDate = new Date(order.createdAt);
              return orderDate.toDateString() === now.toDateString();
            });
            break;

          case "7days":
            filteredOrders = orders.filter((order) => {
              const orderDate = new Date(order.createdAt);
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(now.getDate() - 7);
              return orderDate >= sevenDaysAgo;
            });
            break;

          case "30days":
            filteredOrders = orders.filter((order) => {
              const orderDate = new Date(order.createdAt);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(now.getDate() - 30);
              return orderDate >= thirtyDaysAgo;
            });
            break;

          default:
            filteredOrders = orders;
        }

        const grouped = {};
        filteredOrders.forEach((order) => {
          const date = new Date(order.createdAt).toISOString().split("T")[0];
          grouped[date] = (grouped[date] || 0) + 1;
        });

        const chartData = Object.entries(grouped).map(([date, count]) => ({
          date,
          orders: count,
        }));

        setOrdersChartData(chartData);

        const revenueMap = {};
        filteredOrders.forEach((order) => {
          const date = new Date(order.createdAt).toISOString().split("T")[0];
          revenueMap[date] = (revenueMap[date] || 0) + order.total;
        });

        const revenueData = Object.entries(revenueMap).map(
          ([date, revenue]) => ({
            date,
            revenue: parseFloat(revenue.toFixed(2)),
          })
        );

        setRevenueChartData(revenueData);
      } catch (error) {
        console.error("Error fetching orders data:", error);
      }
    };

    fetchOrdersData();
  }, [dateFilter]);

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="mb-10 animate__fadeInUp">
        {/* Search bar and filters */}
        {/* <div className="flex items-center gap-4 mb-8">
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
            <option value="today">Today</option>
            <option value="all">All Time</option>
          </select>
        </div> */}

        <div className="flex items-center gap-4 mb-8">
          <select
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
            <option value="today">Today</option>
            <option value="all">All Time</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
          <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h4 className="text-lg font-semibold">Total Orders</h4>
            <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h4 className="text-lg font-semibold">Pending Orders</h4>
            <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h4 className="text-lg font-semibold">Total Products</h4>
            <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
          </div>

          <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
            <h4 className="text-lg font-semibold">Total Users</h4>
            <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
          </div>
        </div>

        {/* Orders and Revenue Charts Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Orders Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
              🛒 Orders Statistics
            </h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ordersChartData}>
                  <defs>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#ec4899"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
              💰 Revenue Statistics
            </h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
