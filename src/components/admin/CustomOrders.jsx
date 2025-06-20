import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

const CustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priceEdits, setPriceEdits] = useState({});
  const [updatingPriceIds, setUpdatingPriceIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const [selectedItem, setSelectedItem] = useState(null);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#f472b6" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #f472b6" : "none",
      "&:hover": { borderColor: "#f472b6" },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#fbcfe8" : "#fff",
      color: "#000",
    }),
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        "https://bakeryproject-1onw.onrender.com/api/custom-orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const activeOrders = res.data.filter(
        (order) => order.status !== "Delivered"
      );
      setOrders(activeOrders);
      setFilteredOrders(activeOrders);

      const prices = {};
      activeOrders.forEach((order) => {
        prices[order._id] = order.price ?? "";
      });
      setPriceEdits(prices);
    } catch (err) {
      console.error("Error fetching custom orders", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://bakeryproject-1onw.onrender.com/api/custom-orders/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handlePriceChange = async (orderId, newPrice) => {
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum < 0) return;

    try {
      setUpdatingPriceIds((prev) => new Set(prev).add(orderId));
      const token = localStorage.getItem("authToken");
      await axios.put(
        `https://bakeryproject-1onw.onrender.com/api/custom-orders/${orderId}/update-price`,
        { price: priceNum },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error updating price", err);
    } finally {
      setUpdatingPriceIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Processing":
        return "bg-blue-100 text-blue-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const name = order.user?.name?.toLowerCase() || "";
      const email = order.user?.email?.toLowerCase() || "";
      const searchMatch =
        name.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());
      const statusMatch = statusFilter ? order.status === statusFilter : true;
      return searchMatch && statusMatch;
    });
    setFilteredOrders(filtered);
  }, [search, statusFilter, orders]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // **هنا حذفنا شرط الإخفاء أثناء التحميل**، ليظهر الجدول دائماً

  return (
    <div className="max-w-6xl mx-auto p-2">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Custom Orders</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-pink-400"
        />
        <Select
          value={
            statusFilter ? { label: statusFilter, value: statusFilter } : null
          }
          onChange={(opt) => setStatusFilter(opt ? opt.value : "")}
          options={[
            { label: "All Statuses", value: "" },
            { label: "Pending", value: "Pending" },
            { label: "Processing", value: "Processing" },
            { label: "Delivered", value: "Delivered" },
          ]}
          styles={customStyles}
          placeholder="Filter by Status"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="table min-w-[1500px] divide-y divide-gray-200">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Details</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-center">Created At</th>
              <th className="py-3 px-4 text-center">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">{order.user?.email || "N/A"}</td>
                  <td className="px-4 py-3 max-w-xs truncate">
                    <button
                      onClick={() =>
                        setSelectedItem({
                          description: order.description,
                          designImage: order.designImage,
                        })
                      }
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md text-sm"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceEdits[order._id] ?? ""}
                      disabled={updatingPriceIds.has(order._id)}
                      onChange={(e) =>
                        setPriceEdits((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }))
                      }
                      onBlur={() =>
                        handlePriceChange(order._id, priceEdits[order._id])
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handlePriceChange(order._id, priceEdits[order._id]);
                          e.target.blur();
                        }
                      }}
                      className="border border-gray-300 p-1 rounded w-24 text-center"
                      placeholder="Set price"
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Select
                      value={{ label: order.status, value: order.status }}
                      onChange={(selectedOption) =>
                        updateStatus(order._id, selectedOption.value)
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  {/* {loading ? "Loading orders..." : "No orders found."} */}
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredOrders.length > 0 && (
        <div className="flex justify-center items-center gap-6 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
            <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
              Order Details
            </h2>

            <div className="mb-4 flex justify-center">
              <img
                src={selectedItem.designImage}
                alt="Design"
                className="max-h-48 object-contain rounded-md border"
              />
            </div>

            <div className="mb-2 text-sm font-medium text-gray-700">
              Description:
            </div>
            <div className="max-h-64 overflow-y-auto pr-2 mb-4">
              <div className="border border-gray-300 rounded p-3 bg-gray-50 text-gray-800 text-sm whitespace-pre-wrap">
                {selectedItem.description}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrders;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";

// const CustomOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [priceEdits, setPriceEdits] = useState({}); // حالة الأسعار المؤقتة
//   const [updatingPriceIds, setUpdatingPriceIds] = useState(new Set()); // IDs أثناء تحديث السعر
//   const [currentPage, setCurrentPage] = useState(1);
//   const ordersPerPage = 10;

//   // const [selectedDescription, setSelectedDescription] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);


//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? "#f472b6" : "#ccc",
//       boxShadow: state.isFocused ? "0 0 0 1px #f472b6" : "none",
//       "&:hover": { borderColor: "#f472b6" },
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused ? "#fbcfe8" : "#fff",
//       color: "#000",
//     }),
//   };

//   const fetchOrders = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       const res = await axios.get(
//         "https://bakeryproject-1onw.onrender.com/api/custom-orders",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const activeOrders = res.data.filter(
//         (order) => order.status !== "Delivered"
//       );
//       setOrders(activeOrders);
//       setFilteredOrders(activeOrders);

//       // تهيئة priceEdits
//       const prices = {};
//       activeOrders.forEach((order) => {
//         prices[order._id] = order.price ?? "";
//       });
//       setPriceEdits(prices);
//     } catch (err) {
//       console.error("Error fetching custom orders", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (id, newStatus) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       await axios.put(
//         `https://bakeryproject-1onw.onrender.com/api/custom-orders/${id}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       fetchOrders();
//     } catch (err) {
//       console.error("Error updating status", err);
//     }
//   };

//   const handlePriceChange = async (orderId, newPrice) => {
//     const priceNum = parseFloat(newPrice);
//     if (isNaN(priceNum) || priceNum < 0) return; // السعر غير صالح لا ترسل

//     try {
//       setUpdatingPriceIds((prev) => new Set(prev).add(orderId));
//       const token = localStorage.getItem("authToken");
//       await axios.put(
//         `https://bakeryproject-1onw.onrender.com/api/custom-orders/${orderId}/update-price`,
//         { price: priceNum },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       fetchOrders();
//     } catch (err) {
//       console.error("Error updating price", err);
//     } finally {
//       setUpdatingPriceIds((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(orderId);
//         return newSet;
//       });
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "Processing":
//         return "bg-blue-100 text-blue-700";
//       case "Delivered":
//         return "bg-green-100 text-green-700";
//       case "Cancelled":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     const filtered = orders.filter((order) => {
//       const name = order.user?.name?.toLowerCase() || "";
//       const email = order.user?.email?.toLowerCase() || "";
//       const searchMatch =
//         name.includes(search.toLowerCase()) ||
//         email.includes(search.toLowerCase());
//       const statusMatch = statusFilter ? order.status === statusFilter : true;
//       return searchMatch && statusMatch;
//     });
//     setFilteredOrders(filtered);
//   }, [search, statusFilter, orders]);

//   const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

//   const indexOfLastOrder = currentPage * ordersPerPage;
//   const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
//   const currentOrders = filteredOrders.slice(
//     indexOfFirstOrder,
//     indexOfLastOrder
//   );

//   if (loading) return <div className="text-center py-8">Loading...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-2">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Custom Orders</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         />
//         <Select
//           value={
//             statusFilter ? { label: statusFilter, value: statusFilter } : null
//           }
//           onChange={(opt) => setStatusFilter(opt ? opt.value : "")}
//           options={[
//             { label: "All Statuses", value: "" },
//             { label: "Pending", value: "Pending" },
//             { label: "Processing", value: "Processing" },
//             { label: "Delivered", value: "Delivered" },
//           ]}
//           styles={customStyles}
//           placeholder="Filter by Status"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="table min-w-[1500px] divide-y divide-gray-200">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-4 text-left">Order ID</th>
//               <th className="py-3 px-4 text-left">Customer</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-left">Details</th>
//               {/* <th className="py-3 px-4 text-center">Design</th> */}
//               <th className="py-3 px-4 text-center">Status</th>
//               <th className="py-3 px-4 text-left">Price</th>
//               <th className="py-3 px-4 text-center">Created At</th>
//               <th className="py-3 px-4 text-center">Change</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {currentOrders.map((order) => (
//               <tr
//                 key={order._id}
//                 className="border-b hover:bg-gray-50 transition"
//               >
//                 <td className="px-4 py-3">{order._id}</td>
//                 <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
//                 <td className="px-4 py-3">{order.user?.email || "N/A"}</td>
//                 <td className="px-4 py-3 max-w-xs truncate">
//                   <button
//                     // onClick={() => setSelectedDescription(order.description)}
//                     onClick={() => setSelectedItem({ description: order.description, designImage: order.designImage })}

//                     className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md text-sm"
//                   >
//                     View
//                   </button>
//                 </td>

//                 {/* <td className="px-4 py-3 text-center">
//                   <img
//                     src={order.designImage}
//                     alt="Design"
//                     className="h-16 mx-auto object-contain rounded-md border"
//                   />
//                 </td> */}
//                 <td className="px-4 py-3 text-center">
//                   <span
//                     className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-4 py-3">
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     value={priceEdits[order._id] ?? ""}
//                     disabled={updatingPriceIds.has(order._id)}
//                     onChange={(e) =>
//                       setPriceEdits((prev) => ({
//                         ...prev,
//                         [order._id]: e.target.value,
//                       }))
//                     }
//                     onBlur={() =>
//                       handlePriceChange(order._id, priceEdits[order._id])
//                     }
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         handlePriceChange(order._id, priceEdits[order._id]);
//                         e.target.blur(); // لإزالة التركيز بعد Enter
//                       }
//                     }}
//                     className="border border-gray-300 p-1 rounded w-24 text-center"
//                     placeholder="Set price"
//                   />
//                 </td>
//                 <td className="px-4 py-3 text-center">
//                   {new Date(order.createdAt).toLocaleString()}
//                 </td>
//                 <td className="px-4 py-3 text-center">
//                   <Select
//                     value={{ label: order.status, value: order.status }}
//                     onChange={(selectedOption) =>
//                       updateStatus(order._id, selectedOption.value)
//                     }
//                     options={[
//                       { label: "Pending", value: "Pending" },
//                       { label: "Processing", value: "Processing" },
//                       { label: "Shipped", value: "Shipped" },
//                       { label: "Delivered", value: "Delivered" },
//                       { label: "Cancelled", value: "Cancelled" },
//                     ]}
//                     styles={customStyles}
//                     isSearchable={false}
//                     menuPlacement="auto"
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {filteredOrders.length > 0 && (
//         <div className="flex justify-center items-center gap-6 mt-6">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           >
//             Previous
//           </button>
//           <span className="text-lg">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//             className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           >
//             Next
//           </button>
//         </div>
//       )}
//       {/* {selectedDescription && (
//         <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
//           <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
//             <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
//               Order Description
//             </h2>

//             <div className="max-h-64 overflow-y-auto pr-2">
//               <div className="border border-gray-300 rounded p-3 bg-gray-50 text-gray-800 text-sm whitespace-pre-wrap">
//                 {selectedDescription}
//               </div>
//             </div>

//             <div className="mt-6 flex justify-end">
//               <button
//                 onClick={() => setSelectedDescription(null)}
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )} */}
//       {selectedItem && (
//   <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
//     <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
//       <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
//         Order Details
//       </h2>

//       {/* كلمة Design قبل الصورة */}
//       {/* <div className="mb-2 text-sm font-medium text-gray-700">Design</div> */}
//       <div className="mb-4 flex justify-center">
//         <img
//           src={selectedItem.designImage}
//           alt="Design"
//           className="max-h-48 object-contain rounded-md border"
//         />
//       </div> 

//       {/* كلمة Description قبل الوصف */}
//       <div className="mb-2 text-sm font-medium text-gray-700">Description:</div>
//       <div className="max-h-64 overflow-y-auto pr-2 mb-4">
//         <div className="border border-gray-300 rounded p-3 bg-gray-50 text-gray-800 text-sm whitespace-pre-wrap">
//           {selectedItem.description}
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <button
//           onClick={() => setSelectedItem(null)}
//           className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
// };

// export default CustomOrders;
