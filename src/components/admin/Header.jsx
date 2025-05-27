import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaSearch } from "react-icons/fa";
import NotificationDropdown from "../admin/NotificationDropdown";
import { useNavigate } from "react-router-dom";

const Header = () => {
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

          // جلب المنتجات
          const productsRes = await axios.get(
            "https://bakeryproject-1onw.onrender.com/api/products/all",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // جلب المستخدمين
          const usersRes = await axios.get(
            "https://bakeryproject-1onw.onrender.com/api/admin/users",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // جلب الطلبات
          const ordersRes = await axios.get(
            "https://bakeryproject-1onw.onrender.com/api/orders",
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // فلترة المنتجات
          const filteredProducts = productsRes.data
            .filter((p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5)
            .map((p) => ({ ...p, type: "product" }));

          // فلترة المستخدمين حسب الاسم أو الإيميل
          const filteredUsers = usersRes.data
            .filter(
              (u) =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, 5)
            .map((u) => ({ ...u, type: "user" }));

          // فلترة الطلبات حسب رقم الطلب أو اسم المستخدم
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

          // دمج النتائج
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
      navigate(`/admin/user-list?search=${item.name}`);
    } else if (item.type === "order") {
      navigate(`/admin/order-details/${item._id}`); // مثلا صفحة تفاصيل الطلب
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      {/* معلومات الأدمن */}
      <div className="flex items-center gap-4">
        <img
          src={
            admin?.image
              ? `https://bakeryproject-1onw.onrender.com/${admin.image}`
              : "../../../public/admin_image.jpg"
          }
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

      {/* شريط البحث مع قائمة منسدلة */}
      <div className="relative w-full max-w-md mx-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
        </div>

        {showDropdown && searchResults.length > 0 && (
          <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow z-50 max-h-64 overflow-y-auto">
            {searchResults.map((item) => (
              <li
                key={item._id}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between"
              >
                <span>
                  {item.type === "product"
                    ? item.name
                    : item.type === "user"
                    ? `${item.name} (${item.email})`
                    : `Order #${item._id} (${item.user?.name || "N/A"})`}
                </span>
                <span className="text-gray-400 italic text-xs">
                  {item.type === "product"
                    ? "Product"
                    : item.type === "user"
                    ? item.role || "User"
                    : "Order"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* الإشعارات */}
      <div className="relative">
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default Header;

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
//         const token = localStorage.getItem("token");
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
//           const token = localStorage.getItem("token");
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

//           // دمج النتائج
//           const combined = [...filteredProducts, ...filteredUsers];

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
//       // توجه لصفحة المنتجات مع البحث
//       navigate(`/admin/product-list?search=${item.name}`);
//     } else if (item.type === "user") {
//       // توجه لصفحة المستخدمين مع البحث
//       navigate(`/admin/user-list?search=${item.name}`);
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
//               : "/imgs/admin_image.jpg"
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
//             placeholder="Search products or users..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 pl-10 rounded-md bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
//           />
//           <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
//                     : `${item.name} (${item.email})`}
//                 </span>
//                 <span className="text-gray-400 italic text-xs">
//                   {item.type === "product" ? "Product" : item.role || "User"}
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

//   // جلب بيانات الأدمن
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const token = localStorage.getItem("token");
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

//   // تنفيذ البحث بعد تأخير بسيط
//   useEffect(() => {
//     const delayDebounce = setTimeout(async () => {
//       if (searchTerm.trim()) {
//         try {
//           const res = await axios.get(
//             "https://bakeryproject-1onw.onrender.com/api/products/all"
//           );
//           const filtered = res.data.filter((p) =>
//             p.name.toLowerCase().includes(searchTerm.toLowerCase())
//           );
//           setSearchResults(filtered.slice(0, 5)); // عرض أول 5 نتائج
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

//   const handleSelect = (productId) => {
//     setSearchTerm("");
//     setShowDropdown(false);
//     navigate(`/admin/product-list?search=${productId}`); // أو navigate(`/product/${productId}`) لعرض صفحة منتج
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
//       {/* معلومات الأدمن */}
//       <div className="flex items-center gap-4">
//         <img
//           src={
//             admin?.image
//               ? `https://bakeryproject-1onw.onrender.com/${admin.image}`
//               : "/imgs/admin_image.jpg"
//           }
//           alt="Admin Profile"
//           className="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow"
//         />
//         <div>
//           <p className="text-sm text-gray-500">Welcome back,</p>
//           <h2 className="text-lg font-semibold text-gray-800">{admin?.name || "Admin"}</h2>
//         </div>
//       </div>

//       {/* شريط البحث مع قائمة منسدلة */}
//       <div className="relative w-full max-w-md mx-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full px-4 py-2 pl-10 rounded-md bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
//           />
//           {/* <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
//         </div>
//         {showDropdown && searchResults.length > 0 && (
//           <ul className="absolute w-full bg-white border border-gray-200 rounded-md mt-1 shadow z-50 max-h-64 overflow-y-auto">
//             {searchResults.map((product) => (
//               <li
//                 key={product._id}
//                 onClick={() => handleSelect(product.name)}
//                 className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
//               >
//                 {product.name}
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


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import NotificationDropdown from "../admin/NotificationDropdown";


// const Header = () => {
//   const [admin, setAdmin] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // جلب بيانات المسؤول
//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const decodedToken = jwtDecode(token);
//         const userId = decodedToken.userId;

//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/users",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const adminData = response.data.find(
//           (user) => user._id === userId && user.role === "admin"
//         );

//         if (adminData) {
//           setAdmin(adminData);
//         } else {
//           console.warn("❌ No admin found for this token.");
//         }
//       } catch (error) {
//         console.error("❌ Error fetching admin data:", error);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   // تنفيذ البحث بعد تأخير عند توقف المستخدم عن الكتابة (Debounce)
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim()) {
//         console.log("🔍 البحث عن:", searchTerm);
//         // يمكنك تنفيذ بحث فعلي هنا عبر API أو التنقل لصفحة نتائج
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm]);

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
//       {/* معلومات المسؤول */}
//       <div className="flex items-center gap-4">
//         <img
//           src={
//             admin?.image
//               ? `https://bakeryproject-1onw.onrender.com/${admin.image}`
//               : "/imgs/admin_image.jpg"
//           }
//           alt="Admin Profile"
//           className="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow"
//         />
//         <div className="leading-tight">
//           <p className="text-sm text-gray-500">Welcome back,</p>
//           <h2 className="text-lg font-semibold text-gray-800">
//             {admin?.name || "Admin"}
//           </h2>
//         </div>
//       </div>

//       {/* شريط البحث */}
//       <div className="flex justify-center flex-1 mx-6">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-96 px-4 py-2 rounded-md bg-gray-100 border border-gray-300 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300 transition"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* الإشعارات */}
//       <div className="relative">
//         <NotificationDropdown />
//       </div>
//     </header>
//   );
// };

// export default Header;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";
// import NotificationDropdown from "../admin/NotificationDropdown";

// const Header = () => {
//   const [admin, setAdmin] = useState(null);

//   useEffect(() => {
//     const fetchAdminData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const decodedToken = jwtDecode(token);
//         const userId = decodedToken.userId;

//         const response = await axios.get(
//           "https://bakeryproject-1onw.onrender.com/api/admin/users",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const adminData = response.data.find(
//           (user) => user._id === userId && user.role === "admin"
//         );

//         if (adminData) {
//           setAdmin(adminData);
//         } else {
//           console.warn("❌ No admin found for this token.");
//         }
//       } catch (error) {
//         console.error("❌ Error fetching admin data:", error);
//       }
//     };

//     fetchAdminData();
//   }, []);

//   return (
//     <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200 px-6 py-3 flex items-center justify-between">
//       {/* معلومات المسؤول */}
//       <div className="flex items-center gap-4">
//         <img
//           src={
//             admin?.image
//               ? `https://bakeryproject-1onw.onrender.com/${admin.image}`
//               : "/imgs/admin_image.jpg"
//           }
//           alt="Admin Profile"
//           className="w-10 h-10 rounded-full object-cover border-2 border-pink-300 shadow"
//         />
//         <div className="leading-tight">
//           <p className="text-sm text-gray-500">Welcome back,</p>
//           <h2 className="text-lg font-semibold text-gray-800">{admin?.name || "Admin"}</h2>
//         </div>
//       </div>

//       {/* الإشعارات */}
//       <div className="relative">
//         <NotificationDropdown />
//       </div>
//     </header>
//   );
// };

// export default Header;
