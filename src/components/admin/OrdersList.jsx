// import React, { useState, useEffect } from "react";

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token"); // تأكد أن التوكن محفوظ في localStorage
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Unauthorized or failed to fetch");
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await fetch(`https://bakeryproject-1onw.onrender.com/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       console.error("Failed to update order:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-200 text-yellow-800";
//       case "Processing":
//         return "bg-blue-200 text-blue-800";
//       case "Shipped":
//         return "bg-purple-200 text-purple-800";
//       case "Delivered":
//         return "bg-green-200 text-green-800";
//       case "Cancelled":
//         return "bg-red-200 text-red-800";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const customerName = order.user?.name?.toLowerCase() || "";
//     const matchesSearch =
//       customerName.includes(searchTerm.toLowerCase()) ||
//       order._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter ? order.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   const handleViewDetails = (order) => setSelectedOrder(order);
//   const handleCloseModal = () => setSelectedOrder(null);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Orders List</h1>

//       {/* Search and filter */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or order ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/4"
//         >
//           <option value="">All Statuses</option>
//           <option value="Pending">Pending</option>
//           <option value="Processing">Processing</option>
//           <option value="Shipped">Shipped</option>
//           <option value="Delivered">Delivered</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded">
//           <thead>
//             <tr className="bg-pink-700 text-white">
//               <th className="py-3 px-4">Order ID</th>
//               <th className="py-3 px-4">Customer Name</th>
//               <th className="py-3 px-4">Customer Email</th>
//               <th className="py-3 px-4">Status</th>
//               <th className="py-3 px-4">Change Status</th>
//               <th className="py-3 px-4">Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr key={order._id} className="border-b hover:bg-gray-50 transition">
//                 <td className="py-3 px-4 text-center font-semibold">{order._id}</td>
//                 <td className="py-3 px-4 text-center">{order.user?.name || "N/A"}</td>
//                 <td className="py-3 px-4 text-center">{order.user?.email || "N/A"}</td>
//                 <td className="py-3 px-4 text-center">
//                   <span
//                     className={`py-1 px-3 rounded-full text-sm font-semibold ${getStatusColor(
//                       order.status
//                     )}`}
//                   >
//                     {order.status || "Pending"}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <select
//                     value={order.status || "Pending"}
//                     onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                     className="border rounded p-2"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Shipped">Shipped</option>
//                     <option value="Delivered">Delivered</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <button
//                     onClick={() => handleViewDetails(order)}
//                     className="bg-pink-700 hover:bg-pink-800 text-white px-3 py-1 rounded"
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   No matching orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-xl font-bold mb-4">
//               Order Details - #{selectedOrder._id}
//             </h3>
//             <ul className="space-y-2">
//               {selectedOrder.products?.map((product, index) => (
//                 <li key={index} className="border-b pb-2">
//                   <div>Product: {product.name}</div>
//                   <div>Quantity: {product.quantity}</div>
//                   <div>Price: {product.price} EGP</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersList;
// -----------------------------------------------------------------
// OrdersList.jsx
import React, { useState, useEffect } from "react";

import Select from "react-select";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://bakeryproject-1onw.onrender.com/api/orders",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Unauthorized or failed to fetch");
        const data = await response.json();

        // استبعاد الطلبات التي حالتها Delivered
        const activeOrders = data.filter(
          (order) => order.status !== "Delivered"
        );
        setOrders(activeOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      await fetch(
        `https://bakeryproject-1onw.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      setOrders((prev) =>
        prev
          .filter(
            (order) => !(order._id === orderId && newStatus === "Delivered")
          )
          .map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
      );
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Shipped":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const customerName = order.user?.name?.toLowerCase() || "";
    const matchesSearch =
      customerName.includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? order.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // ⭐ تخصيص ألوان الـ Select
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "#fbcfe8" // اللون عند الـ hover
        : "white", // لا يوجد لون عند التحديد
      color: "black",
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#f472b6" : "#ccc", // تغيير اللون عند التركيز
      boxShadow: state.isFocused ? "0 0 0 1px #f472b6" : "none", // الظل عند التركيز
      "&:hover": {
        borderColor: "#f472b6", // اللون عند الـ hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      border: "none", // إزالة الحدود حول القائمة
      borderRadius: "0.375rem",
      marginTop: "2px",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      display: "none", // إخفاء علامة "X"
    }),
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        📦 Orders Management
      </h1> */}
            <h1 className="text-3xl font-bold mb-6 text-pink-700">
        Orders Management
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by customer or order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-pink-400"
        />
        <Select
          value={
            statusFilter
              ? { label: statusFilter, value: statusFilter }
              : { label: "All Statuses", value: "" }
          }
          onChange={(selectedOption) =>
            setStatusFilter(selectedOption ? selectedOption.value : "")
          }
          options={[
            { label: "All Statuses", value: "" },
            { label: "Pending", value: "Pending" },
            { label: "Processing", value: "Processing" },
            { label: "Shipped", value: "Shipped" },
            { label: "Cancelled", value: "Cancelled" },
          ]}
          styles={customStyles}
          placeholder="Filter by status"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Total Price</th>
              <th className="py-3 px-4 text-center">Change</th>
              <th className="py-3 px-4 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">{order.user?.email || "N/A"}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.products.reduce(
                      (sum, product) => sum + product.price * product.quantity,
                      0
                    )}{" "}
                    EGP
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Select
                      value={{ label: order.status, value: order.status }}
                      onChange={(selectedOption) =>
                        handleStatusChange(order._id, selectedOption.value)
                      }
                      options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Processing", value: "Processing" },
                        { label: "Shipped", value: "Shipped" },
                        { label: "Delivered", value: "Delivered" },
                        { label: "Cancelled", value: "Cancelled" },
                      ]}
                      styles={customStyles}
                      isSearchable={false}
                      menuPlacement="auto"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              Order #{selectedOrder._id}
            </h2>
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {selectedOrder.products?.map((product, index) => (
                <li key={index} className="border-b pb-2">
                  <div>
                    <strong>Product:</strong> {product.name}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {product.quantity}
                  </div>
                  <div>
                    <strong>Price:</strong> {product.price} EGP
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

// --------------------------- تصميم ثاني -----------------------------
// import React, { useState, useEffect } from "react";

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/orders", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) throw new Error("Unauthorized or failed to fetch");
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     try {
//       const token = localStorage.getItem("token");
//       await fetch(`https://bakeryproject-1onw.onrender.com/api/orders/${orderId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       setOrders((prev) =>
//         prev.map((order) =>
//           order._id === orderId ? { ...order, status: newStatus } : order
//         )
//       );
//     } catch (error) {
//       console.error("Failed to update order:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Processing":
//         return "bg-blue-100 text-blue-700";
//       case "Shipped":
//         return "bg-purple-100 text-purple-700";
//       case "Delivered":
//         return "bg-green-100 text-green-700";
//       case "Cancelled":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const customerName = order.user?.name?.toLowerCase() || "";
//     const matchesSearch =
//       customerName.includes(searchTerm.toLowerCase()) ||
//       order._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus = statusFilter ? order.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
//         📦 Orders Management
//       </h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by customer or order ID"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/2 focus:ring-2 focus:ring-pink-400"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border border-gray-300 px-4 py-2 rounded-md w-full md:w-1/3 focus:ring-2 focus:ring-pink-400"
//         >
//           <option value="">All Statuses</option>
//           <option value="Pending">Pending</option>
//           <option value="Processing">Processing</option>
//           <option value="Shipped">Shipped</option>
//           <option value="Delivered">Delivered</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders Table */}
//       <div className="verflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-4 text-left">Order ID</th>
//               <th className="py-3 px-4 text-left">Customer</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-center">Status</th>
//               <th className="py-3 px-4 text-center">Change</th>
//               <th className="py-3 px-4 text-center">Details</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {filteredOrders.length > 0 ? (
//               filteredOrders.map((order) => (
//                 <tr key={order._id} className="border-b hover:bg-gray-50 transition">
//                   <td className="px-4 py-3">{order._id}</td>
//                   <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
//                   <td className="px-4 py-3">{order.user?.email || "N/A"}</td>
//                   <td className="px-4 py-3 text-center">
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     <select
//                       value={order.status}
//                       onChange={(e) =>
//                         handleStatusChange(order._id, e.target.value)
//                       }
//                       className="border border-gray-300 px-2 py-1 rounded-md"
//                     >
//                       <option value="Pending">Pending</option>
//                       <option value="Processing">Processing</option>
//                       <option value="Shipped">Shipped</option>
//                       <option value="Delivered">Delivered</option>
//                       <option value="Cancelled">Cancelled</option>
//                     </select>
//                   </td>
//                   <td className="px-4 py-3 text-center">
//                     <button
//                       onClick={() => setSelectedOrder(order)}
//                       className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md text-sm"
//                     >
//                       View Details
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   No orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg w-96 shadow-xl relative">
//             <button
//               onClick={() => setSelectedOrder(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
//             >
//               ✖
//             </button>
//             <h2 className="text-xl font-bold mb-4">
//               Order #{selectedOrder._id}
//             </h2>
//             <ul className="space-y-3 max-h-60 overflow-y-auto">
//               {selectedOrder.products?.map((product, index) => (
//                 <li key={index} className="border-b pb-2">
//                   <div><strong>Product:</strong> {product.name}</div>
//                   <div><strong>Quantity:</strong> {product.quantity}</div>
//                   <div><strong>Price:</strong> {product.price} EGP</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersList;

// import React, { useState, useEffect } from "react";

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null); // For the details modal

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch("https://your-api/orders");
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setOrders([
//           {
//             id: 1,
//             customerName: "Ahmed Ali",
//             status: "Pending",
//             date: "2025-04-25",
//             products: [
//               { name: "Chocolate Cake", quantity: 2, price: 30 },
//               { name: "Strawberry Tart", quantity: 1, price: 20 },
//             ],
//           },
//           {
//             id: 2,
//             customerName: "Sara Mohamed",
//             status: "Shipped",
//             date: "2025-04-24",
//             products: [{ name: "Baguette Bread", quantity: 3, price: 15 }],
//           },
//         ]);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//     try {
//       await fetch(`https://your-api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//     } catch (error) {
//       console.error("Failed to update order:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-200 text-yellow-800";
//       case "Processing":
//         return "bg-blue-200 text-blue-800";
//       case "Shipped":
//         return "bg-purple-200 text-purple-800";
//       case "Delivered":
//         return "bg-green-200 text-green-800";
//       case "Cancelled":
//         return "bg-red-200 text-red-800";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toString().includes(searchTerm);
//     const matchesStatus = statusFilter ? order.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//   };

//   const handleCloseModal = () => {
//     setSelectedOrder(null);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Orders List</h1>

//       {/* Search and filter bar */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or order ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/4"
//         >
//           <option value="">All Statuses</option>
//           <option value="Pending">Pending</option>
//           <option value="Processing">Processing</option>
//           <option value="Shipped">Shipped</option>
//           <option value="Delivered">Delivered</option>
//           <option value="Cancelled">Cancelled</option>
//         </select>
//       </div>

//       {/* Orders table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded">
//           <thead>
//             <tr className="bg-pink-700 text-white">
//               <th className="py-3 px-4">Order ID</th>
//               <th className="py-3 px-4">Customer Name</th>
//               <th className="py-3 px-4">Order Date</th>
//               <th className="py-3 px-4">Current Status</th>
//               <th className="py-3 px-4">Change Status</th>
//               <th className="py-3 px-4">Details</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr key={order.id} className="border-b hover:bg-gray-50 transition">
//                 <td className="py-3 px-4 text-center font-semibold">{order.id}</td>
//                 <td className="py-3 px-4 text-center">{order.customerName}</td>
//                 <td className="py-3 px-4 text-center">{order.date}</td>
//                 <td className="py-3 px-4 text-center">
//                   <span
//                     className={`py-1 px-3 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                     className="border rounded p-2"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Processing">Processing</option>
//                     <option value="Shipped">Shipped</option>
//                     <option value="Delivered">Delivered</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <button
//                     onClick={() => handleViewDetails(order)}
//                     className="bg-pink-700 hover:bg-pink-800 text-white px-3 py-1 rounded"
//                   >
//                     View Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   No matching orders found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Order details modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-xl font-bold mb-4">Order Details - #{selectedOrder.id}</h3>
//             <ul className="space-y-2">
//               {selectedOrder.products?.map((product, index) => (
//                 <li key={index} className="border-b pb-2">
//                   <div>Product: {product.name}</div>
//                   <div>Quantity: {product.quantity}</div>
//                   <div>Price: {product.price} EGP</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersList;

// --------------------------- نسخه باللغه العربيه ---------------------------
// import React, { useState, useEffect } from "react";

// const OrdersList = () => {
//   const [orders, setOrders] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState(null); // لمودال التفاصيل

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await fetch("https://your-api/orders");
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//         setOrders([
//           {
//             id: 1,
//             customerName: "أحمد علي",
//             status: "Pending",
//             date: "2025-04-25",
//             products: [
//               { name: "كيكة شوكولاتة", quantity: 2, price: 30 },
//               { name: "تارت فراولة", quantity: 1, price: 20 },
//             ],
//           },
//           {
//             id: 2,
//             customerName: "سارة محمد",
//             status: "Shipped",
//             date: "2025-04-24",
//             products: [{ name: "خبز باجيت", quantity: 3, price: 15 }],
//           },
//         ]);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const handleStatusChange = async (orderId, newStatus) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order
//       )
//     );
//     try {
//       await fetch(`https://your-api/orders/${orderId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status: newStatus }),
//       });
//     } catch (error) {
//       console.error("Failed to update order:", error);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending": return "bg-yellow-200 text-yellow-800";
//       case "Processing": return "bg-blue-200 text-blue-800";
//       case "Shipped": return "bg-purple-200 text-purple-800";
//       case "Delivered": return "bg-green-200 text-green-800";
//       case "Cancelled": return "bg-red-200 text-red-800";
//       default: return "bg-gray-200 text-gray-800";
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const matchesSearch =
//       order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toString().includes(searchTerm);
//     const matchesStatus = statusFilter ? order.status === statusFilter : true;
//     return matchesSearch && matchesStatus;
//   });

//   const handleViewDetails = (order) => {
//     setSelectedOrder(order);
//   };

//   const handleCloseModal = () => {
//     setSelectedOrder(null);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">قائمة الطلبات</h1>

//       {/* شريط البحث والتصفية */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="ابحث عن طريق الاسم أو رقم الطلب..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/4"
//         >
//           <option value="">كل الحالات</option>
//           <option value="Pending">قيد الانتظار</option>
//           <option value="Processing">قيد المعالجة</option>
//           <option value="Shipped">تم الشحن</option>
//           <option value="Delivered">تم التوصيل</option>
//           <option value="Cancelled">تم الإلغاء</option>
//         </select>
//       </div>

//       {/* جدول الطلبات */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded">
//           <thead>
//             <tr className="bg-pink-700 text-white">
//               <th className="py-3 px-4">رقم الطلب</th>
//               <th className="py-3 px-4">اسم العميل</th>
//               <th className="py-3 px-4">تاريخ الإنشاء</th>
//               <th className="py-3 px-4">الحالة الحالية</th>
//               <th className="py-3 px-4">تغيير الحالة</th>
//               <th className="py-3 px-4">التفاصيل</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredOrders.map((order) => (
//               <tr key={order.id} className="border-b hover:bg-gray-50 transition">
//                 <td className="py-3 px-4 text-center font-semibold">{order.id}</td>
//                 <td className="py-3 px-4 text-center">{order.customerName}</td>
//                 <td className="py-3 px-4 text-center">{order.date}</td>
//                 <td className="py-3 px-4 text-center">
//                   <span
//                     className={`py-1 px-3 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <select
//                     value={order.status}
//                     onChange={(e) => handleStatusChange(order.id, e.target.value)}
//                     className="border rounded p-2"
//                   >
//                     <option value="Pending">قيد الانتظار</option>
//                     <option value="Processing">قيد المعالجة</option>
//                     <option value="Shipped">تم الشحن</option>
//                     <option value="Delivered">تم التوصيل</option>
//                     <option value="Cancelled">تم الإلغاء</option>
//                   </select>
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <button
//                     onClick={() => handleViewDetails(order)}
//                     className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
//                   >
//                     عرض التفاصيل
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredOrders.length === 0 && (
//               <tr>
//                 <td colSpan="6" className="text-center py-6 text-gray-500">
//                   لا توجد طلبات مطابقة.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* مودال عرض تفاصيل الطلب */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
//             <button
//               onClick={handleCloseModal}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-xl font-bold mb-4">تفاصيل الطلب رقم {selectedOrder.id}</h3>
//             <ul className="space-y-2">
//               {selectedOrder.products?.map((product, index) => (
//                 <li key={index} className="border-b pb-2">
//                   <div>المنتج: {product.name}</div>
//                   <div>الكمية: {product.quantity}</div>
//                   <div>السعر: {product.price} جنيه</div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrdersList;
// --------------------------- نسخه باللغه العربيه ---------------------------
