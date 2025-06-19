import React, { useState, useEffect } from "react";

import Select from "react-select";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("authToken");
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

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

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
        <table className="min-w-[1500px] divide-y divide-gray-200">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Payment</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Total Price</th>
              <th className="py-3 px-4 text-center">Change</th>
              <th className="py-3 px-4 text-center">Details</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{order._id}</td>
                  <td className="px-4 py-3">{order.user?.name || "N/A"}</td>
                  <td className="px-4 py-3">{order.user?.email || "N/A"}</td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
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
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
      <h2 className="text-xl font-semibold text-pink-600 mb-4 text-center">
        Order Details
      </h2>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {selectedOrder.products?.map((product, index) => (
          <div
            key={index}
            className="border rounded-lg px-4 py-3 bg-gray-50 shadow-sm"
          >
            <p className="text-sm">
              <span className="font-medium text-gray-700">Product:</span>{" "}
              {product.name}
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Quantity:</span>{" "}
              {product.quantity}
            </p>
            <p className="text-sm">
              <span className="font-medium text-gray-700">Price:</span>{" "}
              {product.price} EGP
            </p>
          </div>
        ))}
      </div>

      {/* زر الإغلاق */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setSelectedOrder(null)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

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
    </div>
  );
};

export default OrdersList;
