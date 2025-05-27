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
        const token = localStorage.getItem("token");
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
            filteredOrders = orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              return orderDate.toDateString() === now.toDateString();
            });
            break;

          case "7days":
            filteredOrders = orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              const sevenDaysAgo = new Date();
              sevenDaysAgo.setDate(now.getDate() - 7);
              return orderDate >= sevenDaysAgo;
            });
            break;

          case "30days":
            filteredOrders = orders.filter(order => {
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

        const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
          date,
          revenue: parseFloat(revenue.toFixed(2)),
        }));

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
          {/* <NotificationDropdown /> */}
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
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ordersChartData}>
                  <defs>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
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
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">💰 Revenue Statistics</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
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

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// // import NotificationDropdown from "../admin/NotificationDropdown";

// const AdminHome = () => {
//   // const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);
//   const [revenueChartData, setRevenueChartData] = useState([]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/orders",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const orders = response.data;
//         const now = new Date();
//         let filteredOrders = [];

//         switch (dateFilter) {
//           case "today":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               return orderDate.toDateString() === now.toDateString();
//             });
//             break;

//           case "7days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const sevenDaysAgo = new Date();
//               sevenDaysAgo.setDate(now.getDate() - 7);
//               return orderDate >= sevenDaysAgo;
//             });
//             break;

//           case "30days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const thirtyDaysAgo = new Date();
//               thirtyDaysAgo.setDate(now.getDate() - 30);
//               return orderDate >= thirtyDaysAgo;
//             });
//             break;

//           default:
//             filteredOrders = orders;
//         }

//         const grouped = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);

//         const revenueMap = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           revenueMap[date] = (revenueMap[date] || 0) + order.total;
//         });

//         const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
//           date,
//           revenue: parseFloat(revenue.toFixed(2)),
//         }));

//         setRevenueChartData(revenueData);

//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//       }
//     };

//     fetchOrdersData();
//   }, [dateFilter]);

//   // const handleSearchChange = (e) => {
//   //   setSearchQuery(e.target.value);
//   // };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         {/* <h2 className="text-4xl font-bold text-gray-800 mb-6">Overview</h2> */}

//         {/* Search bar and filters */}
//         <div className="flex items-center gap-4 mb-8">
//           {/* <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           /> */}
          
//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>
//           {/* <NotificationDropdown /> */}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Pending Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Products</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Users</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Orders and Revenue Charts Side by Side */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Orders Chart */}
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={ordersChartData}>
//                   <defs>
//                     <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="orders"
//                     stroke="#ec4899"
//                     fillOpacity={1}
//                     fill="url(#colorOrders)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Revenue Chart */}
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">💰 Revenue Statistics</h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueChartData}>
//                   <defs>
//                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#10b981"
//                     fillOpacity={1}
//                     fill="url(#colorRevenue)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// // import NotificationDropdown from "../admin/NotificationDropdown";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);
//   const [revenueChartData, setRevenueChartData] = useState([]);
//   // const [admin, setAdmin] = useState(null); // إضافة حالة لتخزين بيانات المسؤول

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/orders",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const orders = response.data;
//         const now = new Date();
//         let filteredOrders = [];

//         switch (dateFilter) {
//           case "today":
//             filteredOrders = orders.filter((order) => {
//               const orderDate = new Date(order.createdAt);
//               return orderDate.toDateString() === now.toDateString();
//             });
//             break;

//           case "7days":
//             filteredOrders = orders.filter((order) => {
//               const orderDate = new Date(order.createdAt);
//               const sevenDaysAgo = new Date();
//               sevenDaysAgo.setDate(now.getDate() - 7);
//               return orderDate >= sevenDaysAgo;
//             });
//             break;

//           case "30days":
//             filteredOrders = orders.filter((order) => {
//               const orderDate = new Date(order.createdAt);
//               const thirtyDaysAgo = new Date();
//               thirtyDaysAgo.setDate(now.getDate() - 30);
//               return orderDate >= thirtyDaysAgo;
//             });
//             break;

//           default:
//             filteredOrders = orders;
//         }

//         const grouped = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);

//         const revenueMap = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           revenueMap[date] = (revenueMap[date] || 0) + order.total;
//         });

//         const revenueData = Object.entries(revenueMap).map(
//           ([date, revenue]) => ({
//             date,
//             revenue: parseFloat(revenue.toFixed(2)),
//           })
//         );

//         setRevenueChartData(revenueData);
//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//       }
//     };

//     fetchOrdersData();
//   }, [dateFilter]);
//   useEffect(() => {
//   const fetchAdminData = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const decodedToken = jwtDecode(token);

//       console.log("✅ Decoded Token:", decodedToken);

//       const userId = decodedToken.userId; // ✅ استخدم المفتاح الصحيح

//       const response = await axios.get(
//         "https://bakeryproject-1onw.onrender.com/api/admin/users",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       console.log("✅ Users from API:", response.data);

//       const adminData = response.data.find(
//         (user) => user._id === userId && user.role === "admin"
//       );

//       if (adminData) {
//         console.log("✅ Admin Found:", adminData);
//         setAdmin(adminData);
//       } else {
//         console.warn("❌ No admin found for this token.");
//       }
//     } catch (error) {
//       console.error("❌ Error fetching admin data:", error);
//     }
//   };

//   fetchAdminData();
// }, []);


//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         {/* <h2 className="text-4xl font-bold text-gray-800 mb-6">Overview</h2> */}

//         {/* عرض اسم المسؤول وصورته */}
//         {/* {admin && (
//           <div className="flex items-center mb-6">
//             <img
//               src={
//                 admin.image
//                   ? `https://bakeryproject-1onw.onrender.com/${admin.image}`
//                   : "/imgs/admin_image.jpg"
//               }
//               alt="Admin Profile"
//               className="w-16 h-16 rounded-full mr-3 object-cover border"
//             />
//             <h3 className="text-xl font-bold">Welcome, {admin.name}</h3>
//           </div>
//         )} */}

//         {/* Search bar and filters */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>
//           {/* <NotificationDropdown /> */}
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Pending Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Products</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Users</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Orders and Revenue Charts Side by Side */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Orders Chart */}
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
//               🛒 Orders Statistics
//             </h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={ordersChartData}>
//                   <defs>
//                     <linearGradient
//                       id="colorOrders"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="orders"
//                     stroke="#ec4899"
//                     fillOpacity={1}
//                     fill="url(#colorOrders)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Revenue Chart */}
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
//               💰 Revenue Statistics
//             </h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueChartData}>
//                   <defs>
//                     <linearGradient
//                       id="colorRevenue"
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#10b981"
//                     fillOpacity={1}
//                     fill="url(#colorRevenue)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// ------------------- style1--------------------------
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add notification
//   const addNotification = (message) => {
//     store.addNotification({
//       title: "New Alert",
//       message: message,
//       type: "default",
//       container: "bottom-left",
//       animationIn: ["animated", "fadeIn"],
//       animationOut: ["animated", "fadeOut"],
//       dismiss: {
//         duration: 3000,
//       },
//     });
//   };

//   // Fetch order data for the chart
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const orders = response.data;

//         const grouped = {};

//         orders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);
//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//         addNotification("❌ Failed to load order data.");
//       }
//     };

//     fetchOrdersData();
//     fetchNotifications();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">Overview</h2>

//         {/* Search bar and filters */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="🔍 Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate__slideInDown z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">No notifications.</li>
//                     ) : (
//                       notifications.map((notification, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Enhanced Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           {/* Card 1: Total Orders */}
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
//           </div>

//           {/* Card 2: Pending Orders */}
//           <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Pending Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
//           </div>

//           {/* Card 3: Total Products */}
//           <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Products</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
//           </div>

//           {/* Card 4: Total Users */}
//           <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Users</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Orders Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={ordersChartData}>
//                 <defs>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#ec4899"
//                   fillOpacity={1}
//                   fill="url(#colorOrders)"
//                   animationDuration={1500} // Animation effect
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Button to add a notification */}
//         <div className="mt-12 flex justify-center animate__fadeInUp delay-400">
//           <button
//             onClick={() => addNotification("✨ New Notification: Orders have been updated")}
//             className="p-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
//           >
//             ➕ Add New Notification
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;
// ------------------- style1--------------------------

// ------------------- style2--------------------------
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);
//   const [revenueChartData, setRevenueChartData] = useState([]);

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addNotification = (message) => {
//     store.addNotification({
//       title: "New Alert",
//       message: message,
//       type: "default",
//       container: "bottom-left",
//       animationIn: ["animated", "fadeIn"],
//       animationOut: ["animated", "fadeOut"],
//       dismiss: {
//         duration: 3000,
//       },
//     });
//   };

//   // Fetch order data with filter
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const orders = response.data;
//         const now = new Date();
//         let filteredOrders = [];

//         switch (dateFilter) {
//           case "today":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               return orderDate.toDateString() === now.toDateString();
//             });
//             break;

//           case "7days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const sevenDaysAgo = new Date();
//               sevenDaysAgo.setDate(now.getDate() - 7);
//               return orderDate >= sevenDaysAgo;
//             });
//             break;

//           case "30days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const thirtyDaysAgo = new Date();
//               thirtyDaysAgo.setDate(now.getDate() - 30);
//               return orderDate >= thirtyDaysAgo;
//             });
//             break;

//           default:
//             filteredOrders = orders; // All time
//         }

//         const grouped = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);

//         // 🟩 الإيرادات حسب اليوم
//         const revenueMap = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           revenueMap[date] = (revenueMap[date] || 0) + order.total;
//         });

//         const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
//           date,
//           revenue: parseFloat(revenue.toFixed(2)),
//         }));

//         setRevenueChartData(revenueData);

//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//         addNotification("Failed to load order data.");
//       }
//     };

//     fetchOrdersData();
//     fetchNotifications();
//   }, [dateFilter]);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">Overview</h2>

//         {/* Search bar and filters */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate__slideInDown z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">No notifications.</li>
//                     ) : (
//                       notifications.map((notification, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Pending Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Products</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Users</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Orders and Revenue Charts Side by Side */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Orders Chart */}
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={ordersChartData}>
//                   <defs>
//                     <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="orders"
//                     stroke="#ec4899"
//                     fillOpacity={1}
//                     fill="url(#colorOrders)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Revenue Chart */}
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">💰 Revenue Statistics</h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueChartData}>
//                   <defs>
//                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#10b981"
//                     fillOpacity={1}
//                     fill="url(#colorRevenue)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// ---------------------------------

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);
//   const [revenueChartData, setRevenueChartData] = useState([]);

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // ✅ Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(
//         "https://bakeryproject-1onw.onrender.com/api/notifications/admin",
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // Sort notifications by newest first
//       const sorted = response.data.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setNotifications(sorted);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔄 Poll for notifications every minute
//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 60000); // كل 60 ثانية
//     return () => clearInterval(interval);
//   }, []);

//   const addNotification = (message) => {
//     store.addNotification({
//       title: "New Alert",
//       message: message,
//       type: "default",
//       container: "bottom-left",
//       animationIn: ["animated", "fadeIn"],
//       animationOut: ["animated", "fadeOut"],
//       dismiss: {
//         duration: 3000,
//       },
//     });
//   };

//   // Fetch orders with filter
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/orders",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const orders = response.data;
//         const now = new Date();
//         let filteredOrders = [];

//         switch (dateFilter) {
//           case "today":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               return orderDate.toDateString() === now.toDateString();
//             });
//             break;

//           case "7days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const sevenDaysAgo = new Date();
//               sevenDaysAgo.setDate(now.getDate() - 7);
//               return orderDate >= sevenDaysAgo;
//             });
//             break;

//           case "30days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const thirtyDaysAgo = new Date();
//               thirtyDaysAgo.setDate(now.getDate() - 30);
//               return orderDate >= thirtyDaysAgo;
//             });
//             break;

//           default:
//             filteredOrders = orders; // All time
//         }

//         const grouped = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);

//         // Revenue chart
//         const revenueMap = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           revenueMap[date] = (revenueMap[date] || 0) + order.total;
//         });

//         const revenueData = Object.entries(revenueMap).map(([date, revenue]) => ({
//           date,
//           revenue: parseFloat(revenue.toFixed(2)),
//         }));

//         setRevenueChartData(revenueData);
//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//         addNotification("Failed to load order data.");
//       }
//     };

//     fetchOrdersData();
//   }, [dateFilter]);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">Overview</h2>

//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>

//           {/* 🔔 Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border animate__slideInDown z-20 max-h-96 overflow-auto">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">No notifications.</li>
//                     ) : (
//                       notifications.map((notification, index) => (
//                         <li
//                           key={index}
//                           className="p-4 hover:bg-gray-100 border-b last:border-0"
//                         >
//                           <div className="text-sm text-gray-700">{notification.message}</div>
//                           <div className="text-xs text-gray-400">
//                             {new Date(notification.createdAt).toLocaleString("en-US", {
//                               dateStyle: "short",
//                               timeStyle: "short",
//                             })}
//                           </div>
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Dashboard Stats */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Pending Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Products</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Users</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={ordersChartData}>
//                   <defs>
//                     <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="orders"
//                     stroke="#ec4899"
//                     fillOpacity={1}
//                     fill="url(#colorOrders)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="bg-white p-8 rounded-2xl shadow-md">
//             <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">💰 Revenue Statistics</h3>
//             <div className="w-full h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueChartData}>
//                   <defs>
//                     <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Area
//                     type="monotone"
//                     dataKey="revenue"
//                     stroke="#10b981"
//                     fillOpacity={1}
//                     fill="url(#colorRevenue)"
//                     animationDuration={1500}
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// ------------------- style3--------------------------
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addNotification = (message) => {
//     store.addNotification({
//       title: "New Alert",
//       message: message,
//       type: "default",
//       container: "bottom-left",
//       animationIn: ["animated", "fadeIn"],
//       animationOut: ["animated", "fadeOut"],
//       dismiss: {
//         duration: 3000,
//       },
//     });
//   };

//   // Fetch order data with filter
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const orders = response.data;
//         const now = new Date();
//         let filteredOrders = [];

//         switch (dateFilter) {
//           case "today":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               return orderDate.toDateString() === now.toDateString();
//             });
//             break;

//           case "7days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const sevenDaysAgo = new Date();
//               sevenDaysAgo.setDate(now.getDate() - 7);
//               return orderDate >= sevenDaysAgo;
//             });
//             break;

//           case "30days":
//             filteredOrders = orders.filter(order => {
//               const orderDate = new Date(order.createdAt);
//               const thirtyDaysAgo = new Date();
//               thirtyDaysAgo.setDate(now.getDate() - 30);
//               return orderDate >= thirtyDaysAgo;
//             });
//             break;

//           default:
//             filteredOrders = orders; // All time
//         }

//         const grouped = {};
//         filteredOrders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);
//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//         addNotification("❌ Failed to load order data.");
//       }
//     };

//     fetchOrdersData();
//     fetchNotifications();
//   }, [dateFilter]);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">Overview</h2>

//         {/* Search bar and filters */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="🔍 Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate__slideInDown z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">No notifications.</li>
//                     ) : (
//                       notifications.map((notification, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-pink-400 to-red-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Pending Orders</h4>
//             <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Products</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
//           </div>

//           <div className="p-6 bg-gradient-to-r from-indigo-400 to-blue-500 text-white rounded-lg shadow-lg hover:scale-105 transition-transform">
//             <h4 className="text-lg font-semibold">Total Users</h4>
//             <p className="text-3xl font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Orders Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={ordersChartData}>
//                 <defs>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#ec4899"
//                   fillOpacity={1}
//                   fill="url(#colorOrders)"
//                   animationDuration={1500}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);

//   // Fetch dashboard data
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // Fetch notifications
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add notification
//   const addNotification = (message) => {
//     store.addNotification({
//       title: "New Alert",
//       message: message,
//       type: "default",
//       container: "bottom-left",
//       animationIn: ["animated", "fadeIn"],
//       animationOut: ["animated", "fadeOut"],
//       dismiss: {
//         duration: 3000,
//       },
//     });
//   };

//   // Fetch order data for the chart
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const orders = response.data;

//         const grouped = {};

//         orders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);
//       } catch (error) {
//         console.error("Error fetching orders data:", error);
//         addNotification("❌ Failed to load order data.");
//       }
//     };

//     fetchOrdersData();
//     fetchNotifications();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate__fadeInUp">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

//         {/* Search bar and filters */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="🔍 Search for users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate__slideInDown z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">No notifications.</li>
//                     ) : (
//                       notifications.map((notification, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Statistics Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate__fadeInUp">
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">Total Orders</h4>
//             <p className="text-2xl text-purple-600 font-bold">{dashboardData.totalOrders}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">Pending Orders</h4>
//             <p className="text-2xl text-pink-500 font-bold">{dashboardData.pendingOrders}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">Total Products</h4>
//             <p className="text-2xl text-green-500 font-bold">{dashboardData.totalProducts}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">Total Users</h4>
//             <p className="text-2xl text-indigo-500 font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* Orders Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Orders Statistics</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={ordersChartData}>
//                 <defs>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#ec4899"
//                   fillOpacity={1}
//                   fill="url(#colorOrders)"
//                   animationDuration={1500} // Animation effect
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Button to add notification */}
//         <div className="mt-12 flex justify-center animate__fadeInUp delay-400">
//           <button
//             onClick={() => addNotification("✨ New Notification: Orders Updated")}
//             className="p-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
//           >
//             ➕ Add New Notification
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// // ربط بال api
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";
// import { store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);
//   const [dashboardData, setDashboardData] = useState({
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalProducts: 0,
//     totalUsers: 0,
//   });
//   const [ordersChartData, setOrdersChartData] = useState([]);

//   // جلب بيانات لوحة التحكم
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/dashboard",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setDashboardData(response.data);
//       } catch (error) {
//         console.error("خطأ في جلب بيانات لوحة التحكم:", error);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   // جلب الإشعارات
//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("خطأ في جلب الإشعارات:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // إشعارات منبثقة
//   const addNotification = (message) => {
//     store.addNotification({
//       title: "تنبيه جديد",
//       message: message,
//       type: "default",
//       container: "bottom-left",
//       animationIn: ["animated", "fadeIn"],
//       animationOut: ["animated", "fadeOut"],
//       dismiss: {
//         duration: 3000,
//       },
//     });
//   };

//   // جلب بيانات الطلبات وتحويلها لرسم بياني
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const orders = response.data;

//         const grouped = {};

//         orders.forEach((order) => {
//           const date = new Date(order.createdAt).toISOString().split("T")[0];
//           grouped[date] = (grouped[date] || 0) + 1;
//         });

//         const chartData = Object.entries(grouped).map(([date, count]) => ({
//           date,
//           orders: count,
//         }));

//         setOrdersChartData(chartData);
//       } catch (error) {
//         console.error("خطأ في جلب بيانات الطلبات:", error);
//         addNotification("❌ تعذر تحميل بيانات الطلبات.");
//       }
//     };

//     fetchOrdersData();
//     fetchNotifications();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       <div className="mb-10 animate-fade-in-up">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">نظرة عامة على لوحة التحكم</h2>

//         {/* شريط البحث والفلاتر */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="🔍 ابحث عن المستخدمين أو المنتجات أو الطلبات..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">آخر 30 يوم</option>
//             <option value="7days">آخر 7 أيام</option>
//             <option value="today">اليوم</option>
//             <option value="all">كل الوقت</option>
//           </select>

//           {/* إشعارات */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate-slide-down z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">لا توجد إشعارات.</li>
//                     ) : (
//                       notifications.map((notification, index) => (
//                         <li key={index} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* بطاقات الإحصائيات */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 animate-fade-in-up">
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">إجمالي الطلبات</h4>
//             <p className="text-2xl text-purple-600 font-bold">{dashboardData.totalOrders}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">الطلبات المعلّقة</h4>
//             <p className="text-2xl text-pink-500 font-bold">{dashboardData.pendingOrders}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">عدد المنتجات</h4>
//             <p className="text-2xl text-green-500 font-bold">{dashboardData.totalProducts}</p>
//           </div>
//           <div className="p-4 bg-white shadow rounded-lg text-center">
//             <h4 className="text-gray-700 font-semibold">عدد المستخدمين</h4>
//             <p className="text-2xl text-indigo-500 font-bold">{dashboardData.totalUsers}</p>
//           </div>
//         </div>

//         {/* رسم بياني لعدد الطلبات اليومية */}
//         <div className="bg-white p-6 rounded-lg shadow mt-10">
//           <h3 className="text-lg font-semibold mb-4 text-gray-700">عدد الطلبات اليومية</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={ordersChartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="date" />
//               <YAxis />
//               <Tooltip />
//               <Line type="monotone" dataKey="orders" stroke="#8884d8" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* زر لإضافة إشعار */}
//         <div className="mt-12 flex justify-center animate-fade-in-up delay-400">
//           <button
//             onClick={() => addNotification("✨ إشعار جديد: تم تحديث الطلبات")}
//             className="p-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
//           >
//             ➕ إضافة إشعار جديد
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// ---------------------------------------------------

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);

//   const data = [
//     { name: "January", sales: 4000 },
//     { name: "February", sales: 3000 },
//     { name: "March", sales: 5000 },
//     { name: "April", sales: 4000 },
//     { name: "May", sales: 6000 },
//   ];

//   const ordersData = [
//     { date: "2025-04-01", orders: 20 },
//     { date: "2025-04-02", orders: 35 },
//     { date: "2025-04-03", orders: 25 },
//     { date: "2025-04-04", orders: 50 },
//     { date: "2025-04-05", orders: 40 },
//     { date: "2025-04-06", orders: 60 },
//     { date: "2025-04-07", orders: 45 },
//   ];

//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addNotification = (message) => {
//     setNotifications((prev) => [
//       ...prev,
//       { id: prev.length + 1, message },
//     ]);
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       {/* Overview Section */}
//       <div className="mb-10 animate-fade-in-up">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

//         {/* Search & Filter */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="🔍 Search users, products, or orders..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">Last 30 Days</option>
//             <option value="7days">Last 7 Days</option>
//             <option value="today">Today</option>
//             <option value="all">All Time</option>
//           </select>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate-slide-down z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">No notifications.</li>
//                     ) : (
//                       notifications.map((notification) => (
//                         <li key={notification.id} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Statistics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-100">
//         <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
//           <h3 className="text-xl font-semibold text-gray-600 mb-4">💰 Total Revenue</h3>
//           <p className="text-3xl font-bold text-green-500">$12,345.67</p>
//         </div>
//         <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
//           <h3 className="text-xl font-semibold text-gray-600 mb-4">🛒 Total Orders</h3>
//           <p className="text-3xl font-bold text-blue-500">1,234</p>
//         </div>
//         <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
//           <h3 className="text-xl font-semibold text-gray-600 mb-4">👥 Total Customers</h3>
//           <p className="text-3xl font-bold text-purple-500">567</p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-300">
//         {/* Sales Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">📈 Sales Statistics</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="sales"
//                   stroke="#4f46e5"
//                   strokeWidth={3}
//                   activeDot={{ r: 8 }}
//                   animationDuration={1500}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Orders Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 Order Statistics</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={ordersData}>
//                 <defs>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#ec4899"
//                   fillOpacity={1}
//                   fill="url(#colorOrders)"
//                   animationDuration={1500}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Add Notification Button */}
//       <div className="mt-12 flex justify-center animate-fade-in-up delay-400">
//         <button
//           onClick={() => addNotification("✨ New Notification: Orders updated")}
//           className="p-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
//         >
//           ➕ Add New Notification
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;

// --------------- ياللغه العربيه ---------------
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaBell } from "react-icons/fa";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   AreaChart,
//   Area,
// } from "recharts";

// const AdminHome = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [dateFilter, setDateFilter] = useState("30days");
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOpen, setIsOpen] = useState(false);

//   const data = [
//     { name: "يناير", مبيعات: 4000 },
//     { name: "فبراير", مبيعات: 3000 },
//     { name: "مارس", مبيعات: 5000 },
//     { name: "أبريل", مبيعات: 4000 },
//     { name: "مايو", مبيعات: 6000 },
//   ];

//   const ordersData = [
//     { date: "2025-04-01", orders: 20 },
//     { date: "2025-04-02", orders: 35 },
//     { date: "2025-04-03", orders: 25 },
//     { date: "2025-04-04", orders: 50 },
//     { date: "2025-04-05", orders: 40 },
//     { date: "2025-04-06", orders: 60 },
//     { date: "2025-04-07", orders: 45 },
//   ];

//   const fetchNotifications = async () => {
//     try {
//       const response = await axios.get("https://api.example.com/notifications");
//       setNotifications(response.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addNotification = (message) => {
//     setNotifications((prev) => [
//       ...prev,
//       { id: prev.length + 1, message },
//     ]);
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleDateFilterChange = (e) => {
//     setDateFilter(e.target.value);
//   };

//   const toggleNotifications = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
//       {/* Overview Section */}
//       <div className="mb-10 animate-fade-in-up">
//         <h2 className="text-4xl font-bold text-gray-800 mb-6">نظرة عامة</h2>

//         {/* Search & Filter */}
//         <div className="flex items-center gap-4 mb-8">
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={handleSearchChange}
//             placeholder="🔍 ابحث عن مستخدمين، منتجات، أو طلبات..."
//             className="p-3 w-1/3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           />

//           <select
//             value={dateFilter}
//             onChange={handleDateFilterChange}
//             className="p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
//           >
//             <option value="30days">آخر 30 يوم</option>
//             <option value="7days">آخر أسبوع</option>
//             <option value="today">اليوم</option>
//             <option value="all">الكل</option>
//           </select>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:scale-110 transition"
//               onClick={toggleNotifications}
//             >
//               <FaBell size={22} />
//             </button>

//             {notifications.length > 0 && (
//               <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
//             )}

//             {isOpen && (
//               <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border animate-slide-down z-20">
//                 {loading ? (
//                   <div className="flex justify-center items-center p-6">
//                     <div className="loader ease-linear rounded-full border-4 border-t-4 border-purple-400 h-8 w-8"></div>
//                   </div>
//                 ) : (
//                   <ul>
//                     {notifications.length === 0 ? (
//                       <li className="p-6 text-center text-gray-400">لا توجد إشعارات.</li>
//                     ) : (
//                       notifications.map((notification) => (
//                         <li key={notification.id} className="p-4 hover:bg-gray-100 border-b last:border-0">
//                           {notification.message}
//                         </li>
//                       ))
//                     )}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Statistics Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-100">
//         <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
//           <h3 className="text-xl font-semibold text-gray-600 mb-4">💰 إجمالي الإيرادات</h3>
//           <p className="text-3xl font-bold text-green-500">$12,345.67</p>
//         </div>
//         <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
//           <h3 className="text-xl font-semibold text-gray-600 mb-4">🛒 إجمالي الطلبات</h3>
//           <p className="text-3xl font-bold text-blue-500">1,234</p>
//         </div>
//         <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1">
//           <h3 className="text-xl font-semibold text-gray-600 mb-4">👥 إجمالي العملاء</h3>
//           <p className="text-3xl font-bold text-purple-500">567</p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up delay-300">
//         {/* Sales Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">📈 إحصائيات المبيعات</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="مبيعات"
//                   stroke="#4f46e5"
//                   strokeWidth={3}
//                   activeDot={{ r: 8 }}
//                   animationDuration={1500} // هنا الانيميشن
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Orders Chart */}
//         <div className="bg-white p-8 rounded-2xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-700 mb-6 text-center">🛒 إحصائيات الطلبات</h3>
//           <div className="w-full h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={ordersData}>
//                 <defs>
//                   <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
//                     <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" />
//                 <YAxis />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="orders"
//                   stroke="#ec4899"
//                   fillOpacity={1}
//                   fill="url(#colorOrders)"
//                   animationDuration={1500} // هنا الانيميشن كمان
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Add Notification Button */}
//       <div className="mt-12 flex justify-center animate-fade-in-up delay-400">
//         <button
//           onClick={() => addNotification("✨ إشعار جديد: تم تحديث الطلبات")}
//           className="p-4 px-8 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full shadow-md hover:shadow-lg transition transform hover:scale-105"
//         >
//           ➕ إضافة إشعار جديد
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;
