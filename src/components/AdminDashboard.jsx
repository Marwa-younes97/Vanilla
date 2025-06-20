// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import { FaChevronDown, FaChevronUp, FaHome } from "react-icons/fa";
// // import logo from "../assets/logo.png"; // Adjust the path to your logo

// import {
//   FaBoxOpen,
//   FaUsers,
//   FaChartLine,
//   FaTags,
//   FaEnvelope,
//   FaCogs,
//   FaClipboardList,
// } from "react-icons/fa";

// import Header from "./admin/Header";

// import StoreStats from "./admin/StoreStats";
// import ProductList from "./admin/ProductList";
// import AddProduct from "./admin/AddProduct";
// import OrdersList from "./admin/OrdersList";
// import UsersList from "./admin/UsersList";
// import ReviewsList from "./admin/ReviewsList";
// import SalesList from "./admin/SalesList";
// import Offers from "./admin/Offers";
// import ContactMessages from "./admin/ContactMessages";
// import SiteSettings from "./admin/SiteSettings";
// import AdminHome from "./admin/AdminHome";
// import CustomOrders from "./admin/CustomOrders";


// const AdminDashboard = () => {
//   const [openMenu, setOpenMenu] = useState("");
// const [sidebarOpen, setSidebarOpen] = useState(false);

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? "" : menu);
//   };

//   const menuItems = [
//     {
//       title: "Products",
//       icon: <FaBoxOpen className="mr-2" />,
//       items: [
//         { label: "Product List", path: "/admin/product-list" },
//         { label: "Add Product", path: "/admin/add-product" },
//       ],
//     },
//     {
//       title: "Orders",
//       icon: <FaClipboardList className="mr-2" />,
//       items: [
//         { label: "Orders List", path: "/admin/orders-list" },
//         { label: "Custom Orders", path: "/admin/custom-orders" },
//       ],
//     },
//     {
//       title: "Users",
//       icon: <FaUsers className="mr-2" />,
//       items: [{ label: "Users List", path: "/admin/users-list" }],
//     },
//     {
//       title: "Reviews",
//       icon: <FaEnvelope className="mr-2" />,
//       items: [{ label: "Reviews List", path: "/admin/reviews-list" }],
//     },
//     {
//       title: "Sales",
//       icon: <FaChartLine className="mr-2" />,
//       items: [{ label: "Sales List", path: "/admin/sales-list" }],
//     },
//     {
//       title: "Offers",
//       icon: <FaTags className="mr-2" />,
//       items: [{ label: "Offers List", path: "/admin/offers" }],
//     },
//     {
//       title: "Contact Messages",
//       icon: <FaEnvelope className="mr-2" />,
//       items: [{ label: "View Messages", path: "/admin/contact-messages" }],
//     },
//     {
//       title: "Settings",
//       icon: <FaCogs className="mr-2" />,
//       items: [{ label: "General Settings", path: "/admin/site-settings" }],
//     },
//   ];

//   return (
    
//     <div className="flex h-screen">
      
//       {/* Sidebar */}
//       {/* <aside className="w-64 bg-gray-800 text-white flex flex-col overflow-auto">
//         <Link
//           to="/admin"
//           className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-400 flex-shrink-0"
//         >
//           Admin Panel
//         </Link>
//         <a
//           href="/"
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400 mx-4 mt-4"
//         >
//           <FaHome />
//           <span className="ml-2">Visit Site</span>
//         </a>
//         <nav className="flex-1 p-4 space-y-4 overflow-auto">
//           {menuItems.map((menu) =>
//             menu.items.length === 1 ? (
//               <Link
//                 key={menu.title}
//                 to={menu.items[0].path}
//                 className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400"
//               >
//                 {menu.icon}
//                 {menu.title}
//               </Link>
//             ) : (
//               <div key={menu.title}>
//                 <button
//                   onClick={() => toggleMenu(menu.title)}
//                   className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//                 >
//                   <span className="flex items-center">
//                     {menu.icon}
//                     {menu.title}
//                   </span>
//                   <span>
//                     {openMenu === menu.title ? (
//                       <FaChevronUp className="ml-2" />
//                     ) : (
//                       <FaChevronDown className="ml-2" />
//                     )}
//                   </span>
//                 </button>
//                 {openMenu === menu.title && (
//                   <div className="pl-4 mt-2 space-y-2">
//                     {menu.items.map((subItem) => (
//                       <Link
//                         key={subItem.label}
//                         to={subItem.path}
//                         className="block hover:text-pink-400"
//                       >
//                         {subItem.label}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )
//           )}
//         </nav>
//       </aside> */}
//       <aside
//   className={`fixed z-50 inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col overflow-auto transform transition-transform duration-300 ease-in-out
//     md:static md:translate-x-0
//     ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
// >
//   <Link
//     to="/admin"
//     className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-400 flex-shrink-0"
//   >
//     Admin Panel
//   </Link>
//   <a
//     href="/"
//     target="_blank"
//     rel="noopener noreferrer"
//     className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400 mx-4 mt-4"
//   >
//     <FaHome />
//     <span className="ml-2">Visit Site</span>
//   </a>
//   <nav className="flex-1 p-4 space-y-4 overflow-auto">
//     {menuItems.map((menu) =>
//             menu.items.length === 1 ? (
//               <Link
//                 key={menu.title}
//                 to={menu.items[0].path}
//                 className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400"
//               >
//                 {menu.icon}
//                 {menu.title}
//               </Link>
//             ) : (
//               <div key={menu.title}>
//                 <button
//                   onClick={() => toggleMenu(menu.title)}
//                   className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//                 >
//                   <span className="flex items-center">
//                     {menu.icon}
//                     {menu.title}
//                   </span>
//                   <span>
//                     {openMenu === menu.title ? (
//                       <FaChevronUp className="ml-2" />
//                     ) : (
//                       <FaChevronDown className="ml-2" />
//                     )}
//                   </span>
//                 </button>
//                 {openMenu === menu.title && (
//                   <div className="pl-4 mt-2 space-y-2">
//                     {menu.items.map((subItem) => (
//                       <Link
//                         key={subItem.label}
//                         to={subItem.path}
//                         className="block hover:text-pink-400"
//                       >
//                         {subItem.label}
//                       </Link>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )
//           )}
//     {/* باقي القائمة كما هي */}
//   </nav>
// </aside>


//       {/* Main content area: Header + Main Content */}
//       <div className="flex flex-col flex-1 overflow-hidden">
//         <Header />

//         <main className="flex-1 p-6 bg-gray-100 overflow-auto">
//           <Routes>
//             <Route path="store-stats" element={<StoreStats />} />
//             <Route path="product-list" element={<ProductList />} />
//             <Route path="add-product" element={<AddProduct />} />
//             <Route path="orders-list" element={<OrdersList />} />
//             <Route path="sales-list" element={<SalesList />} />
//             <Route path="users-list" element={<UsersList />} />
//             <Route path="reviews-list" element={<ReviewsList />} />
//             <Route path="offers" element={<Offers />} />
//             <Route path="contact-messages" element={<ContactMessages />} />
//             <Route path="site-settings" element={<SiteSettings />} />
//             <Route path="/" element={<AdminHome />} />
//             <Route path="custom-orders" element={<CustomOrders />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

import {
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaBoxOpen,
  FaUsers,
  FaChartLine,
  FaTags,
  FaEnvelope,
  FaCogs,
  FaClipboardList,
} from "react-icons/fa";

import Header from "./admin/Header";

import StoreStats from "./admin/StoreStats";
import ProductList from "./admin/ProductList";
import AddProduct from "./admin/AddProduct";
import OrdersList from "./admin/OrdersList";
import UsersList from "./admin/UsersList";
import ReviewsList from "./admin/ReviewsList";
import SalesList from "./admin/SalesList";
import Offers from "./admin/Offers";
import ContactMessages from "./admin/ContactMessages";
import SiteSettings from "./admin/SiteSettings";
import AdminHome from "./admin/AdminHome";
import CustomOrders from "./admin/CustomOrders";
import { FaTimes } from "react-icons/fa";
import "../App.css"; 

const AdminDashboard = () => {
  const [openMenu, setOpenMenu] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

const handleLogout = () => {
  localStorage.removeItem("authToken");
  window.location.href = "/login"; // أو استخدم navigate من react-router
};

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const menuItems = [
    {
      title: "Products",
      icon: <FaBoxOpen className="mr-2" />,
      items: [
        { label: "Product List", path: "/admin/product-list" },
        { label: "Add Product", path: "/admin/add-product" },
      ],
    },
    {
      title: "Orders",
      icon: <FaClipboardList className="mr-2" />,
      items: [
        { label: "Orders List", path: "/admin/orders-list" },
        { label: "Custom Orders", path: "/admin/custom-orders" },
      ],
    },
    {
      title: "Users",
      icon: <FaUsers className="mr-2" />,
      items: [{ label: "Users List", path: "/admin/users-list" }],
    },
    {
      title: "Reviews",
      icon: <FaEnvelope className="mr-2" />,
      items: [{ label: "Reviews List", path: "/admin/reviews-list" }],
    },
    {
      title: "Sales",
      icon: <FaChartLine className="mr-2" />,
      items: [{ label: "Sales List", path: "/admin/sales-list" }],
    },
    {
      title: "Offers",
      icon: <FaTags className="mr-2" />,
      items: [{ label: "Offers List", path: "/admin/offers" }],
    },
    {
      title: "Contact Messages",
      icon: <FaEnvelope className="mr-2" />,
      items: [{ label: "View Messages", path: "/admin/contact-messages" }],
    },
    {
      title: "Settings",
      icon: <FaCogs className="mr-2" />,
      items: [{ label: "General Settings", path: "/admin/site-settings" }],
    },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {/* <aside
        className={`fixed z-50 inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col  transform transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      > */}
      <aside
  className={`custom-scrollbar fixed z-50 inset-y-0 left-0 w-64 bg-gray-800 text-white flex flex-col
    transform transition-transform duration-300 ease-in-out
    md:static md:translate-x-0
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
>
  {/* عنوان البانل */}
  <Link
    to="/admin"
    className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-700 flex-shrink-0"
    onClick={() => setSidebarOpen(false)}
  >
    Admin Panel
  </Link>

  {/* ✅ عنصر قابل للتمرير يحتوي على كل شيء */}
  <div className="flex-1 overflow-auto">
    <nav className="p-4 space-y-4">
      {/* Visit Site */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-700"
      >
        <FaHome />
        <span className="ml-2">Visit Site</span>
      </a>

      {/* القائمة الرئيسية */}
      {menuItems.map((menu) =>
        menu.items.length === 1 ? (
          <Link
            key={menu.title}
            to={menu.items[0].path}
            className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-700"
            onClick={() => setSidebarOpen(false)}
          >
            {menu.icon}
            {menu.title}
          </Link>
        ) : (
          <div key={menu.title}>
            <button
              onClick={() => toggleMenu(menu.title)}
              className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
            >
              <span className="flex items-center">
                {menu.icon}
                {menu.title}
              </span>
              <span>
                {openMenu === menu.title ? (
                  <FaChevronUp className="ml-2" />
                ) : (
                  <FaChevronDown className="ml-2" />
                )}
              </span>
            </button>
            {openMenu === menu.title && (
              <div className="pl-4 mt-2 space-y-2">
                {menu.items.map((subItem) => (
                  <Link
                    key={subItem.label}
                    to={subItem.path}
                    className="block hover:text-pink-700"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      )}

      {/* زر Logout في نهاية القائمة */}
      <div className="pt-6 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-700 hover:bg-pink-600 text-white font-medium rounded transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  </div>
</aside>

{sidebarOpen && (
  <button
    onClick={() => setSidebarOpen(false)}
    className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-90 hover:bg-pink-600 text-white shadow-lg transition-colors duration-300 focus:outline-none z-[9999] md:hidden"
    aria-label="Close sidebar"
  >
    <FaTimes size={20} />
  </button>
)}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Routes>
            <Route path="store-stats" element={<StoreStats />} />
            <Route path="product-list" element={<ProductList />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="orders-list" element={<OrdersList />} />
            <Route path="sales-list" element={<SalesList />} />
            <Route path="users-list" element={<UsersList />} />
            <Route path="reviews-list" element={<ReviewsList />} />
            <Route path="offers" element={<Offers />} />
            <Route path="contact-messages" element={<ContactMessages />} />
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="/" element={<AdminHome />} />
            <Route path="custom-orders" element={<CustomOrders />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
