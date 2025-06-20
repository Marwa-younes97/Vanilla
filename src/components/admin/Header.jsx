// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import { FaSearch } from "react-icons/fa";
// import NotificationDropdown from "../admin/NotificationDropdown";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const [admin, setAdmin] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) return;

//         const decodedToken = jwtDecode(token);
//         const userId = decodedToken.userId;

//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/users",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         const adminData = response.data.find(
//           (user) => user._id === userId && user.role === "admin"
//         );
//         setAdmin(adminData);
//       } catch (error) {
//         console.error("❌ Error fetching admin data:", error);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   useEffect(() => {
//     const delayDebounce = setTimeout(async () => {
//       if (searchTerm.trim()) {
//         try {
//           const token = localStorage.getItem("authToken");
//           if (!token) return;

//           // جلب المنتجات
//           const productsRes = await axios.get(
//             "https://bakeryproject-1onw.onrender.com/api/products/all",
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           // جلب المستخدمين
//           const usersRes = await axios.get(
//             "https://bakeryproject-1onw.onrender.com/api/admin/users",
//             { headers: { Authorization: `Bearer ${token}` } }
//           );
// console.log(admin.image)
//           // جلب الطلبات
//           const ordersRes = await axios.get(
//             "https://bakeryproject-1onw.onrender.com/api/orders",
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           // فلترة المنتجات
//           const filteredProducts = productsRes.data
//             .filter((p) =>
//               p.name.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .slice(0, 5)
//             .map((p) => ({ ...p, type: "product" }));

//           // فلترة المستخدمين حسب الاسم أو الإيميل
//           const filteredUsers = usersRes.data
//             .filter(
//               (u) =>
//                 u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 u.email.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .slice(0, 5)
//             .map((u) => ({ ...u, type: "user" }));

//           // فلترة الطلبات حسب رقم الطلب أو اسم المستخدم
//           const filteredOrders = ordersRes.data
//             .filter(
//               (order) =>
//                 order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 (order.user?.name
//                   ?.toLowerCase()
//                   .includes(searchTerm.toLowerCase()) ?? false)
//             )
//             .slice(0, 5)
//             .map((order) => ({
//               ...order,
//               type: "order",
//             }));

//           // دمج النتائج
//           const combined = [...filteredProducts, ...filteredUsers, ...filteredOrders];

//           setSearchResults(combined);
//           setShowDropdown(true);
//         } catch (err) {
//           console.error("❌ Error during search:", err);
//         }
//       } else {
//         setSearchResults([]);
//         setShowDropdown(false);
//       }
//     }, 400);
    
//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   const handleSelect = (item) => {
//     setSearchTerm("");
//     setShowDropdown(false);
//     if (item.type === "product") {
//       navigate(`/admin/product-list?search=${item.name}`);
//     } else if (item.type === "user") {
//       navigate(`/admin/user-list?search=${item.name}`);
//     } else if (item.type === "order") {
//       navigate(`/admin/order-details/${item._id}`); // مثلا صفحة تفاصيل الطلب
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
//       {/* معلومات الأدمن */}
//       <div className="flex items-center gap-4">
//         <img
//           src={
//             admin?.image
//               ? `https://bakeryproject-1onw.onrender.com/${admin.image}`
//               : "/user_img.jpg"
//           }
//           alt="Admin Profile"
//           className="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow"
//         />
//         <div>
//           <p className="text-sm text-gray-500">Welcome back,</p>
//           <h2 className="text-lg font-semibold text-gray-800">
//             {admin?.name || "Admin"}
//           </h2>
//         </div>
//       </div>

//       {/* شريط البحث مع قائمة منسدلة */}
//       <div className="relative w-full max-w-md mx-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 pl-10 rounded-md bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
//           />
//           {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
//         </div>

//         {showDropdown && searchResults.length > 0 && (
//           <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow z-50 max-h-64 overflow-y-auto">
//             {searchResults.map((item) => (
//               <li
//                 key={item._id}
//                 onClick={() => handleSelect(item)}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
//               >
//                 <span>
//                   {item.type === "product"
//                     ? item.name
//                     : item.type === "user"
//                     ? `${item.name} (${item.email})`
//                     : `Order #${item._id} (${item.user?.name || "N/A"})`}
//                 </span>
//                 <span className="text-gray-400 italic text-xs">
//                   {item.type === "product"
//                     ? "Product"
//                     : item.type === "user"
//                     ? item.role || "User"
//                     : "Order"}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* الإشعارات */}
//       <div className="relative">
//         <NotificationDropdown />
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
import { FaSearch, FaBars } from "react-icons/fa";
import NotificationDropdown from "../admin/NotificationDropdown";
import { useNavigate } from "react-router-dom";

const Header = ({ onToggleSidebar }) => {
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await axios.get(
          "https://bakeryproject-1onw.onrender.com/api/admin/users",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const adminData = response.data.find(
          (user) => user._id === userId && user.role === "admin"
        );
        setAdmin(adminData);
      } catch (error) {
        console.error("❌ Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) return;

          const productsRes = await axios.get(
            "https://bakeryproject-1onw.onrender.com/api/products/all",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const usersRes = await axios.get(
            "https://bakeryproject-1onw.onrender.com/api/admin/users",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const ordersRes = await axios.get(
            "https://bakeryproject-1onw.onrender.com/api/orders",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          const filteredProducts = productsRes.data
            .filter((p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5)
            .map((p) => ({ ...p, type: "product" }));

          const filteredUsers = usersRes.data
            .filter(
              (u) =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5)
            .map((u) => ({ ...u, type: "user" }));

          const filteredOrders = ordersRes.data
            .filter(
              (order) =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.user?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ?? false)
            )
            .slice(0, 5)
            .map((order) => ({
              ...order,
              type: "order",
            }));

          const combined = [...filteredProducts, ...filteredUsers, ...filteredOrders];

          setSearchResults(combined);
          setShowDropdown(true);
        } catch (err) {
          console.error("❌ Error during search:", err);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelect = (item) => {
    setSearchTerm("");
    setShowDropdown(false);
    if (item.type === "product") {
      navigate(`/admin/product-list?search=${item.name}`);
    } else if (item.type === "user") {
      navigate(`/admin/users-list?search=${item.name}`);
    } else if (item.type === "order") {
      navigate(`/admin/order-details/${item._id}`); // صفحة تفاصيل الطلب
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      {/* زر همبرجر يظهر فقط في الشاشات الصغيرة */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden text-gray-700 hover:text-pink-400 focus:outline-none"
      >
        <FaBars size={24} />
      </button>

      {/* معلومات الأدمن مخفية في الشاشات الصغيرة */}
      <div className="hidden md:flex items-center gap-4">
      <img
  src={
    admin?.image && admin.image.trim() !== ""
      ? `https://bakeryproject-1onw.onrender.com/${admin.image.replace(/\\/g, "/")}`
      : "/user_img.jpg"
  }
  onError={(e) => {
    e.target.onerror = null; // يمنع تكرار الحدث
    e.target.src = "/user_img.jpg"; // fallback تلقائي
  }}
  alt="Admin Profile"
  className="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow"
/>

        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <h2 className="text-lg font-semibold text-gray-800">
            {admin?.name || "Admin"}
          </h2>
        </div>
      </div>

      {/* شريط البحث - يملأ الفراغ المتبقي */}
      <div className="relative flex-1 max-w-md mx-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-md bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        {/* أيقونة البحث */}
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

        {/* قائمة النتائج المنسدلة */}
        {showDropdown && searchResults.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow z-50 max-h-64 overflow-y-auto">
            {searchResults.map((item) => (
              <li
                key={item._id}
                className="px-4 py-2 cursor-pointer hover:bg-pink-100"
                onClick={() => handleSelect(item)}
              >
                {item.type === "product" && (
                  <span>
                    📦 <strong>{item.name}</strong> (Product)
                  </span>
                )}
                {item.type === "user" && (
                  <span>
                    👤 <strong>{item.name}</strong> - {item.email} (User)
                  </span>
                )}
                {item.type === "order" && (
                  <span>
                    🧾 Order: <strong>{item._id}</strong>
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* إشعارات الأدمن */}
      <div>
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default Header;
