import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import logo from "../assets/logo.png"; // Adjust the path to your logo

import {
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

const AdminDashboard = () => {
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
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
      <aside className="w-64 bg-gray-800 text-white flex flex-col overflow-auto">
        <Link
          //   to="/admin"
          //   className="text-center p-6 border-b border-gray-600 flex-shrink-0"
          // >
          //   <img src={logo} alt="Logo" className="mx-auto " />
          to="/admin"
          className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-400 flex-shrink-0"
        >
          Admin Panel
        </Link>

        <nav className="flex-1 p-4 space-y-4 overflow-auto">
          {menuItems.map((menu) =>
            menu.items.length === 1 ? (
              <Link
                key={menu.title}
                to={menu.items[0].path}
                className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400"
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
                        className="block hover:text-pink-400"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
        </nav>
      </aside>

      {/* Main content area: Header + Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

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

// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// import {
//   FaBoxOpen,
//   FaUsers,
//   FaChartLine,
//   FaTags,
//   FaEnvelope,
//   FaCogs,
//   FaClipboardList,
// } from "react-icons/fa";

// import Header from "./admin/Header"; // تأكد من المسار الصحيح

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
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <Header />

//       {/* Container: sidebar + main */}
//       <div className="flex flex-1 h-[calc(100vh-64px)]">
//         {/* Sidebar: طول الشاشة ناقص ارتفاع الهيدر (هنا فرضت الهيدر 64px) */}
//         <aside className="w-64 bg-gray-800 text-white flex flex-col overflow-auto">
//           <Link
//             to="/admin"
//             className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-400 flex-shrink-0"
//           >
//             Admin Panel
//           </Link>

//           <nav className="flex-1 p-4 space-y-4 overflow-auto">
//             {menuItems.map((menu) =>
//               menu.items.length === 1 ? (
//                 <Link
//                   key={menu.title}
//                   to={menu.items[0].path}
//                   className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400"
//                 >
//                   {menu.icon}
//                   {menu.title}
//                 </Link>
//               ) : (
//                 <div key={menu.title}>
//                   <button
//                     onClick={() => toggleMenu(menu.title)}
//                     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//                   >
//                     <span className="flex items-center">
//                       {menu.icon}
//                       {menu.title}
//                     </span>
//                     <span>
//                       {openMenu === menu.title ? (
//                         <FaChevronUp className="ml-2" />
//                       ) : (
//                         <FaChevronDown className="ml-2" />
//                       )}
//                     </span>
//                   </button>
//                   {openMenu === menu.title && (
//                     <div className="pl-4 mt-2 space-y-2">
//                       {menu.items.map((subItem) => (
//                         <Link
//                           key={subItem.label}
//                           to={subItem.path}
//                           className="block hover:text-pink-400"
//                         >
//                           {subItem.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )
//             )}
//           </nav>
//         </aside>

//         {/* Main Content */}
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

// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";

// import {
//   FaBoxOpen,
//   FaPlus,
//   FaList,
//   FaUsers,
//   FaChartLine,
//   FaTags,
//   FaEnvelope,
//   FaCogs,
//   FaClipboardList,
// } from "react-icons/fa";

// import Header from "./admin/Header"; // تأكد من مسار ملف الهيدر الصحيح

// import StoreStats from "./admin/StoreStats";
// import ProductList from "./admin/ProductList";
// import AddProduct from "./admin/AddProduct";
// import OrdersList from "./admin/OrdersList";
// import UsersList from "./admin/UsersList";
// // import SalesStats from "./admin/SalesStats";
// import ReviewsList from "./admin/ReviewsList";
// import SalesList from "./admin/SalesList";
// import Offers from "./admin/Offers";
// import ContactMessages from "./admin/ContactMessages";
// import SiteSettings from "./admin/SiteSettings";
// import AdminHome from "./admin/AdminHome";
// // import CategoryManagement from "./admin/CategoryManagement";
// import CustomOrders from "./admin/CustomOrders";

// const AdminDashboard = () => {
//   const [openMenu, setOpenMenu] = useState("");

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
//     // {
//     //   title: "Categories",
//     //   icon: <FaList className="mr-2" />,
//     //   items: [
//     //     { label: "Manage Categories", path: "/admin/categories-management" },
//     //   ],
//     // },
//     {
//       title: "Orders",
//       icon: <FaClipboardList className="mr-2" />,
//       items: [
//         { label: "Orders List", path: "/admin/orders-list" },
//         { label: "Custom Orders", path: "/admin/custom-orders" }, // ⬅️ هذا السطر أضفناه
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
//       items: [
//         { label: "Sales List", path: "/admin/sales-list" },
//         // { label: "Sales Stats", path: "/admin/sales-stats" },
//       ],
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
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <Header />

//       {/* Sidebar + Main Content */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <aside className="w-64 bg-gray-800 text-white flex flex-col">
//           <Link
//             to="/admin"
//             className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-400"
//           >
//             Admin Panel
//           </Link>

//           <nav className="flex-1 p-4 space-y-4">
//             {menuItems.map((menu) =>
//               menu.items.length === 1 ? (
//                 <Link
//                   key={menu.title}
//                   to={menu.items[0].path}
//                   className="flex items-center p-2 hover:bg-gray-700 rounded hover:text-pink-400"
//                 >
//                   {menu.icon}
//                   {menu.title}
//                 </Link>
//               ) : (
//                 <div key={menu.title}>
//                   <button
//                     onClick={() => toggleMenu(menu.title)}
//                     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//                   >
//                     <span className="flex items-center">
//                       {menu.icon}
//                       {menu.title}
//                     </span>
//                     <span>
//                       {openMenu === menu.title ? (
//                         <FaChevronUp className="ml-2" />
//                       ) : (
//                         <FaChevronDown className="ml-2" />
//                       )}
//                     </span>
//                   </button>
//                   {openMenu === menu.title && (
//                     <div className="pl-4 mt-2 space-y-2">
//                       {menu.items.map((subItem) => (
//                         <Link
//                           key={subItem.label}
//                           to={subItem.path}
//                           className="block hover:text-pink-400"
//                         >
//                           {subItem.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )
//             )}
//           </nav>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 bg-gray-100">
//           <Routes>
//             <Route path="store-stats" element={<StoreStats />} />
//             {/* <Route path="sales-stats" element={<SalesStats />} /> */}
//             <Route path="product-list" element={<ProductList />} />
//             <Route path="add-product" element={<AddProduct />} />
//             {/* <Route
//               path="categories-management"
//               element={<CategoryManagement />}
//             /> */}
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

//  ==================== without header ====================
// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import Header from './admin/Header';

// import {
//   FaBoxOpen,
//   FaPlus,
//   FaList,
//   FaUsers,
//   FaChartLine,
//   FaTags,
//   FaEnvelope,
//   FaCogs,
//   FaClipboardList,
// } from "react-icons/fa";

// import StoreStats from "./admin/StoreStats";
// import ProductList from "./admin/ProductList";
// import AddProduct from "./admin/AddProduct";
// import OrdersList from "./admin/OrdersList";
// import UsersList from "./admin/UsersList";
// // import SalesStats from "./admin/SalesStats";
// import ReviewsList from "./admin/ReviewsList";
// import SalesList from "./admin/SalesList";
// import Offers from "./admin/Offers";
// import ContactMessages from "./admin/ContactMessages";
// import SiteSettings from "./admin/SiteSettings";
// import AdminHome from "./admin/AdminHome";
// // import CategoryManagement from "./admin/CategoryManagement";
// import CustomOrders from "./admin/CustomOrders";

// const AdminDashboard = () => {
//   const [openMenu, setOpenMenu] = useState("");

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
//     // {
//     //   title: "Categories",
//     //   icon: <FaList className="mr-2" />,
//     //   items: [
//     //     { label: "Manage Categories", path: "/admin/categories-management" },
//     //   ],
//     // },
//     {
//       title: "Orders",
//       icon: <FaClipboardList className="mr-2" />,
//       items: [
//         { label: "Orders List", path: "/admin/orders-list" },
//         { label: "Custom Orders", path: "/admin/custom-orders" }, // ⬅️ هذا السطر أضفناه
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
//       items: [
//         { label: "Sales List", path: "/admin/sales-list" },
//         // { label: "Sales Stats", path: "/admin/sales-stats" },
//       ],
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
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white flex flex-col">
//         <Link
//           to="/admin"
//           className="text-center text-2xl font-bold p-6 border-b border-gray-600 hover:text-pink-400"
//         >
//           Admin Panel
//         </Link>

//         <nav className="flex-1 p-4 space-y-4">
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
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-100">
//         <Routes>
//           <Route path="store-stats" element={<StoreStats />} />
//           {/* <Route path="sales-stats" element={<SalesStats />} /> */}
//           <Route path="product-list" element={<ProductList />} />
//           <Route path="add-product" element={<AddProduct />} />
//           {/* <Route
//             path="categories-management"
//             element={<CategoryManagement />}
//           /> */}
//           <Route path="orders-list" element={<OrdersList />} />
//           <Route path="sales-list" element={<SalesList />} />
//           <Route path="users-list" element={<UsersList />} />
//           <Route path="reviews-list" element={<ReviewsList />} />
//           <Route path="offers" element={<Offers />} />
//           <Route path="contact-messages" element={<ContactMessages />} />
//           <Route path="site-settings" element={<SiteSettings />} />
//           <Route path="/" element={<AdminHome />} />
//           <Route path="custom-orders" element={<CustomOrders />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

// ========================= with header =========================

// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";

// import StoreStats from "./admin/StoreStats";
// import ProductList from "./admin/ProductList";
// import AddProduct from "./admin/AddProduct";
// import OrdersList from "./admin/OrdersList";
// import UsersList from "./admin/UsersList";
// import SalesStats from "./admin/SalesStats";
// import ReviewsList from "./admin/ReviewsList";
// import SalesList from "./admin/SalesList";
// import Offers from "./admin/Offers";
// import ContactMessages from "./admin/ContactMessages";
// import SiteSettings from "./admin/SiteSettings";
// import AdminHome from "./admin/AdminHome";
// import CategoryManagement from "./admin/CategoryManagement";

// const AdminDashboard = () => {
//   const [openMenu, setOpenMenu] = useState("");

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? "" : menu);
//   };

//   const menuItems = [
//     {
//       title: "Products",
//       items: [
//         { label: "Product List", path: "/admin/product-list" },
//         { label: "Add Product", path: "/admin/add-product" },
//       ],
//     },
//     {
//       title: "Categories",
//       items: [{ label: "Manage Categories", path: "/admin/categories-management" }],
//     },
//     {
//       title: "Orders",
//       items: [{ label: "Orders List", path: "/admin/orders-list" }],
//     },
//     {
//       title: "Users",
//       items: [{ label: "Users List", path: "/admin/users-list" }],
//     },
//     {
//       title: "Reviews",
//       items: [{ label: "Reviews List", path: "/admin/reviews-list" }],
//     },
//     {
//       title: "Sales",
//       items: [
//         { label: "Sales List", path: "/admin/sales-list" },
//         { label: "Sales Stats", path: "/admin/sales-stats" },
//       ],
//     },
//     {
//       title: "Offers",
//       items: [{ label: "Offers List", path: "/admin/offers" }],
//     },
//     {
//       title: "Contact Messages",
//       items: [{ label: "View Messages", path: "/admin/contact-messages" }],
//     },
//     {
//       title: "Settings",
//       items: [{ label: "General Settings", path: "/admin/site-settings" }],
//     },
//   ];

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white flex flex-col">
//         <div className="text-center text-2xl font-bold p-6 border-b border-gray-600">
//           Admin Panel
//         </div>
//         <nav className="flex-1 p-4 space-y-4">
//           {menuItems.map((menu) => (
//             <div key={menu.title}>
//               {menu.items.length === 1 ? (
//                 <Link
//                   to={menu.items[0].path}
//                   className="block p-2 hover:bg-gray-700 rounded hover:text-pink-400"
//                 >
//                   {menu.title}
//                 </Link>
//               ) : (
//                 <>
//                   <button
//                     onClick={() => toggleMenu(menu.title)}
//                     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//                   >
//                     {menu.title}
//                     <span>{openMenu === menu.title ? "▲" : "▼"}</span>
//                   </button>
//                   {openMenu === menu.title && (
//                     <div className="pl-4 mt-2 space-y-2">
//                       {menu.items.map((subItem) => (
//                         <Link
//                           key={subItem.label}
//                           to={subItem.path}
//                           className="block hover:text-pink-400"
//                         >
//                           {subItem.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-100">
//         <Routes>
//           <Route path="store-stats" element={<StoreStats />} />
//           <Route path="sales-stats" element={<SalesStats />} />
//           <Route path="product-list" element={<ProductList />} />
//           <Route path="add-product" element={<AddProduct />} />
//           <Route path="categories-management" element={<CategoryManagement />} />
//           <Route path="orders-list" element={<OrdersList />} />
//           <Route path="sales-list" element={<SalesList />} />
//           <Route path="users-list" element={<UsersList />} />
//           <Route path="reviews-list" element={<ReviewsList />} />
//           <Route path="offers" element={<Offers />} />
//           <Route path="contact-messages" element={<ContactMessages />} />
//           <Route path="site-settings" element={<SiteSettings />} />
//           <Route path="/" element={<AdminHome />} />
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

// import React, { useState } from "react";
// import { Routes, Route, Link } from "react-router-dom";

// import StoreStats from "./admin/StoreStats";
// import ProductList from "./admin/ProductList";
// import AddProduct from "./admin/AddProduct";
// import OrdersList from "./admin/OrdersList";
// import UsersList from "./admin/UsersList";
// import SalesStats from "./admin/SalesStats";
// import ReviewsList from "./admin/ReviewsList";
// import SalesList from "./admin/SalesList";
// import Offers from "./admin/Offers";
// import ContactMessages from "./admin/ContactMessages";
// import SiteSettings from "./admin/SiteSettings";
// import AdminHome from "./admin/AdminHome"; // تأكد من أن لديك هذا المكون
// import CategoryManagement from "./admin/CategoryManagement";

// const AdminDashboard = () => {
//   const [openMenu, setOpenMenu] = useState(""); // لتوسيع القسم المختار

//   const toggleMenu = (menu) => {
//     setOpenMenu(openMenu === menu ? "" : menu);
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white flex flex-col">
//         <div className="text-center text-2xl font-bold p-6 border-b border-gray-600">
//           Admin Panel
//         </div>
//         <nav className="flex-1 p-4 space-y-4">
//           {/* Dashboard */}
//           {/* <div>
//             <button
//               onClick={() => toggleMenu("dashboard")}
//               className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//             >
//               Dashboard
//               <span>{openMenu === "dashboard" ? "▲" : "▼"}</span>
//             </button>
//             {openMenu === "dashboard" && (
//               <div className="pl-4 mt-2 space-y-2">
//                 <Link to="/admin/store-stats" className="block hover:text-pink-400">Store Stats</Link>
//                 <Link to="/admin/sales-stats" className="block hover:text-pink-400">Sales Stats</Link>
//               </div>
//             )}
//           </div> */}

//           {/* Products */}
//           <div>
//             <button
//               onClick={() => toggleMenu("products")}
//               className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//             >
//               Products
//               <span>{openMenu === "products" ? "▲" : "▼"}</span>
//             </button>
//             {openMenu === "products" && (
//               <div className="pl-4 mt-2 space-y-2">
//                 <Link to="/admin/product-list" className="block hover:text-pink-400">Product List</Link>
//                 <Link to="/admin/add-product" className="block hover:text-pink-400">Add Product</Link>
//               </div>
//             )}
//           </div>
// {/* Categories */}
// <div>
//   <button
//     onClick={() => toggleMenu("categories")}
//     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//   >
//     Categories
//     <span>{openMenu === "categories" ? "▲" : "▼"}</span>
//   </button>
//   {openMenu === "categories" && (
//     <div className="pl-4 mt-2 space-y-2">
//       <Link to="/admin/categories-management" className="block hover:text-pink-400">Manage Categories</Link>
//     </div>
//   )}
// </div>

//           {/* Orders */}
//           <div>
//             <button
//               onClick={() => toggleMenu("orders")}
//               className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//             >
//               Orders
//               <span>{openMenu === "orders" ? "▲" : "▼"}</span>
//             </button>
//             {openMenu === "orders" && (
//               <div className="pl-4 mt-2 space-y-2">
//                 <Link to="/admin/orders-list" className="block hover:text-pink-400">Orders List</Link>
//               </div>
//             )}
//           </div>

//           {/* Users */}
//           <div>
//             <button
//               onClick={() => toggleMenu("users")}
//               className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//             >
//               Users
//               <span>{openMenu === "users" ? "▲" : "▼"}</span>
//             </button>
//             {openMenu === "users" && (
//               <div className="pl-4 mt-2 space-y-2">
//                 <Link to="/admin/users-list" className="block hover:text-pink-400">Users List</Link>
//               </div>
//             )}
//           </div>
//           {/* Reviews */}
// <div>
//   <button
//     onClick={() => toggleMenu("reviews")}
//     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//   >
//     Reviews
//     <span>{openMenu === "reviews" ? "▲" : "▼"}</span>
//   </button>
//   {openMenu === "reviews" && (
//     <div className="pl-4 mt-2 space-y-2">
//       <Link to="/admin/reviews-list" className="block hover:text-pink-400">Reviews List</Link>
//     </div>
//   )}
// </div>
// {/* Sales */}
// {/* Sales */}
// <div>
//   <button
//     onClick={() => toggleMenu("sales")}
//     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//   >
//     Sales
//     <span>{openMenu === "sales" ? "▲" : "▼"}</span>
//   </button>
//   {openMenu === "sales" && (
//     <div className="pl-4 mt-2 space-y-2">
//       <Link to="/admin/sales-list" className="block hover:text-pink-400">Sales List</Link>
//       <Link to="/admin/sales-stats" className="block hover:text-pink-400">Sales Stats</Link>
//     </div>
//   )}
// </div>
// {/* Offers */}
// <div>
//   <button
//     onClick={() => toggleMenu("offers")}
//     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//   >
//     Offers
//     <span>{openMenu === "offers" ? "▲" : "▼"}</span>
//   </button>
//   {openMenu === "offers" && (
//     <div className="pl-4 mt-2 space-y-2">
//       <Link to="/admin/offers" className="block hover:text-pink-400">Offers List</Link>
//     </div>
//   )}
// </div>
// <div>
//   <button
//     onClick={() => toggleMenu("contactMessages")}
//     className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//   >
//     Contact Messages
//     <span>{openMenu === "contactMessages" ? "▲" : "▼"}</span>
//   </button>
//   {openMenu === "contactMessages" && (
//     <div className="pl-4 mt-2 space-y-2">
//       <Link to="/admin/contact-messages" className="block hover:text-pink-400">View Messages</Link>
//     </div>
//   )}
// </div>

//  {/* SiteSettings */}
//  <div>
//             <button
//               onClick={() => toggleMenu("siteSettings")}
//               className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded"
//             >
//               Settings
//               <span>{openMenu === "siteSettings" ? "▲" : "▼"}</span>
//             </button>
//             {openMenu === "siteSettings" && (
//               <div className="pl-4 mt-2 space-y-2">
//                 <Link to="/admin/site-settings" className="block hover:text-pink-400">General Settings</Link>
//               </div>
//             )}
//           </div>

//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 bg-gray-100">
//         <Routes>
//           <Route path="store-stats" element={<StoreStats />} />
//           <Route path="sales-stats" element={<SalesStats />} />
//           <Route path="product-list" element={<ProductList />} />
//           <Route path="add-product" element={<AddProduct />} />
//           <Route path="categories-management" element={<CategoryManagement />} />
//           <Route path="orders-list" element={<OrdersList />} />
//           <Route path="sales-list" element={<SalesList />} />
//           <Route path="users-list" element={<UsersList />} />
//           <Route path="reviews-list" element={<ReviewsList />} />
//           <Route path="offers" element={<Offers />} />
//           <Route path="contact-messages" element={<ContactMessages />} />
//           <Route path="site-settings" element={<SiteSettings />} />
//           <Route path="/" element={<AdminHome />} /> {/* الصفحة الرئيسية للمسؤول */}
//         </Routes>
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;
