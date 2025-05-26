import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { format, startOfWeek, startOfMonth, subDays, subMonths } from "date-fns";

const SalesStats = () => {
  const [salesData, setSalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [uniqueCustomers, setUniqueCustomers] = useState(0);

  useEffect(() => {
    // Sample fake sales data (can be replaced with API)
    const fakeSales = [
      { date: '2025-04-20', revenue: 400, orders: 5, customer: "user1" },
      { date: '2025-04-21', revenue: 800, orders: 8, customer: "user2" },
      { date: '2025-04-22', revenue: 600, orders: 7, customer: "user1" },
      { date: '2025-04-23', revenue: 300, orders: 3, customer: "user3" },
    ];

    setSalesData(fakeSales);

    // Calculate total values
    const totalRevenue = fakeSales.reduce((acc, sale) => acc + sale.revenue, 0);
    const totalOrders = fakeSales.reduce((acc, sale) => acc + sale.orders, 0);
    const customers = new Set(fakeSales.map((sale) => sale.customer));

    setTotalRevenue(totalRevenue);
    setTotalOrders(totalOrders);
    setUniqueCustomers(customers.size);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Sales Dashboard 📈</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-green-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <h2 className="text-xl font-semibold mb-2 text-green-600">💰 Total Revenue</h2>
          <p className="text-2xl text-green-700 font-bold">{totalRevenue} EGP</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <h2 className="text-xl font-semibold mb-2 text-blue-600">📦 Total Orders</h2>
          <p className="text-2xl text-blue-700 font-bold">{totalOrders}</p>
        </div>
        <div className="bg-purple-100 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 text-center">
          <h2 className="text-xl font-semibold mb-2 text-purple-600">👥 Unique Customers</h2>
          <p className="text-2xl text-purple-700 font-bold">{uniqueCustomers}</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 mb-10">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="py-3 px-6 text-sm font-medium">Date</th>
              <th className="py-3 px-6 text-sm font-medium">Revenue</th>
              <th className="py-3 px-6 text-sm font-medium">Orders Count</th>
              <th className="py-3 px-6 text-sm font-medium">Customer</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {salesData.map((sale, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6 text-sm">{sale.date}</td>
                <td className="py-3 px-6 text-sm">{sale.revenue} EGP</td>
                <td className="py-3 px-6 text-sm">{sale.orders}</td>
                <td className="py-3 px-6 text-sm">{sale.customer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Daily Revenue Chart</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            {/* تغيير اللون إلى بينك */}
            <Bar dataKey="revenue" fill="#EC4899" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesStats;


// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
// import { format, startOfWeek, startOfMonth, subDays, subMonths } from "date-fns";

// const SalesStats = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [uniqueCustomers, setUniqueCustomers] = useState(0);

//   useEffect(() => {
//     // Sample fake sales data (can be replaced with API)
//     const fakeSales = [
//       { date: '2025-04-20', revenue: 400, orders: 5, customer: "user1" },
//       { date: '2025-04-21', revenue: 800, orders: 8, customer: "user2" },
//       { date: '2025-04-22', revenue: 600, orders: 7, customer: "user1" },
//       { date: '2025-04-23', revenue: 300, orders: 3, customer: "user3" },
//     ];

//     setSalesData(fakeSales);

//     // Calculate total values
//     const totalRevenue = fakeSales.reduce((acc, sale) => acc + sale.revenue, 0);
//     const totalOrders = fakeSales.reduce((acc, sale) => acc + sale.orders, 0);
//     const customers = new Set(fakeSales.map((sale) => sale.customer));

//     setTotalRevenue(totalRevenue);
//     setTotalOrders(totalOrders);
//     setUniqueCustomers(customers.size);
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-8">Sales Dashboard 📈</h1>

//       {/* Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">💰 Total Revenue</h2>
//           <p className="text-2xl text-green-600">{totalRevenue} EGP</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">📦 Total Orders</h2>
//           <p className="text-2xl text-blue-600">{totalOrders}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">👥 Unique Customers</h2>
//           <p className="text-2xl text-purple-600">{uniqueCustomers}</p>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200 mb-10">
//         <table className="min-w-full bg-white rounded shadow">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-6">Date</th>
//               <th className="py-3 px-6">Revenue</th>
//               <th className="py-3 px-6">Orders Count</th>
//               <th className="py-3 px-6">Customer</th>
//             </tr>
//           </thead>
//           <tbody>
//             {salesData.map((sale, index) => (
//               <tr key={index} className="border-b">
//                 <td className="py-3 px-6">{sale.date}</td>
//                 <td className="py-3 px-6">{sale.revenue} EGP</td>
//                 <td className="py-3 px-6">{sale.orders}</td>
//                 <td className="py-3 px-6">{sale.customer}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Bar Chart */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Daily Revenue Chart</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={salesData}>
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="revenue" fill="#4f46e5" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default SalesStats;



// -----------------------نسخه باللغه العربيه ---------------------
// import React, { useEffect, useState } from "react";
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// const SalesStats = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [totalRevenue, setTotalRevenue] = useState(0);
//   const [totalOrders, setTotalOrders] = useState(0);
//   const [uniqueCustomers, setUniqueCustomers] = useState(0);

//   useEffect(() => {
//     // بيانات وهمية (ممكن تربطيها لاحقًا بـ API)
//     const fakeSales = [
//       { date: '2025-04-20', revenue: 400, orders: 5, customer: "user1" },
//       { date: '2025-04-21', revenue: 800, orders: 8, customer: "user2" },
//       { date: '2025-04-22', revenue: 600, orders: 7, customer: "user1" },
//       { date: '2025-04-23', revenue: 300, orders: 3, customer: "user3" },
//     ];

//     setSalesData(fakeSales);

//     // حساب القيم الإجمالية
//     const totalRevenue = fakeSales.reduce((acc, sale) => acc + sale.revenue, 0);
//     const totalOrders = fakeSales.reduce((acc, sale) => acc + sale.orders, 0);
//     const customers = new Set(fakeSales.map((sale) => sale.customer));

//     setTotalRevenue(totalRevenue);
//     setTotalOrders(totalOrders);
//     setUniqueCustomers(customers.size);
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-8">Sales Dashboard 📈</h1>

//       {/* الكروت */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">💰 إجمالي الإيرادات</h2>
//           <p className="text-2xl text-green-600">{totalRevenue} EGP</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">📦 عدد الطلبات</h2>
//           <p className="text-2xl text-blue-600">{totalOrders}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow text-center">
//           <h2 className="text-xl font-semibold mb-2">👥 العملاء الفريدين</h2>
//           <p className="text-2xl text-purple-600">{uniqueCustomers}</p>
//         </div>
//       </div>

//       {/* الجدول */}
//       <div className="bg-white rounded-lg shadow overflow-x-auto mb-10">
//         <table className="min-w-full text-center">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="py-3 px-6">التاريخ</th>
//               <th className="py-3 px-6">الإيرادات</th>
//               <th className="py-3 px-6">عدد الطلبات</th>
//               <th className="py-3 px-6">العميل</th>
//             </tr>
//           </thead>
//           <tbody>
//             {salesData.map((sale, index) => (
//               <tr key={index} className="border-b">
//                 <td className="py-3 px-6">{sale.date}</td>
//                 <td className="py-3 px-6">{sale.revenue} EGP</td>
//                 <td className="py-3 px-6">{sale.orders}</td>
//                 <td className="py-3 px-6">{sale.customer}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* الرسم البياني */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">مخطط الإيرادات اليومي</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={salesData}>
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="revenue" fill="#4f46e5" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default SalesStats;
// -----------------------نسخه باللغه العربيه ---------------------
