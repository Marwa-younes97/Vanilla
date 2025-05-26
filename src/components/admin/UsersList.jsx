import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Toast from "./Toast"; // تأكد من صحة المسار
import Select from "react-select";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.error("No token found!");
      return;
    }

    fetch("https://bakeryproject-1onw.onrender.com/api/admin/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error.message);
        showToast("Failed to load users", "error");
      });
  }, [token]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user._id !== id));
      showToast("User deleted successfully", "success");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const updatedUsers = users.map((u) =>
      u._id === editingUser._id ? editingUser : u
    );
    setUsers(updatedUsers);
    setIsEditing(false);
    showToast("User updated successfully", "success");
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#f472b6" : "#ccc",
      boxShadow: state.isFocused ? "0 0 0 1px #f472b6" : "none",
      "&:hover": {
        borderColor: "#f472b6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#fbcfe8" : "#fff",
      color: "#000",
    }),
  };

  const filteredUsers = users
    .filter((user) =>
      filterRole === "all" ? true : user.role === filterRole
    )
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="p-6">
      {/*Toast Component */}
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <h1 className="text-3xl font-bold mb-6 text-pink-700">Users Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Field */}
        <Select
          inputValue={searchTerm}
          onInputChange={(newValue) => setSearchTerm(newValue)}
          className="w-full"
          styles={customStyles}
          placeholder="Search by name or email..."
        />

        {/* Role Filter */}
        <Select
          value={filterRole ? { label: filterRole, value: filterRole } : null}
          onChange={(opt) => setFilterRole(opt ? opt.value : "all")}
          options={[
            { label: "All Roles", value: "all" },
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
          ]}
          styles={customStyles}
          placeholder="Filter by Role"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="min-w-full bg-white text-gray-800">
          <thead>
            <tr className="bg-pink-100 text-pink-800">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-center">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 text-center font-medium text-sm">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
                        title="Edit user"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                        title="Delete user"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>

            <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
              Edit User
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">
                  Name:
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  disabled
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="border p-2 rounded w-full focus:outline-pink-400"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">
                  Email:
                </label>
                <input
                  type="email"
                  value={editingUser.email}
                  disabled
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="border p-2 rounded w-full focus:outline-pink-400"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-gray-700 font-semibold">
                  Role:
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="border p-2 rounded w-full focus:outline-pink-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;

// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import Toast from "./Toast"; // تأكد من صحة المسار

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) {
//       console.error("No token found!");
//       return;
//     }

//     fetch("https://bakeryproject-1onw.onrender.com/api/admin/users", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setUsers(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error.message);
//         showToast("Failed to load users", "error");
//       });
//   }, [token]);

//   const showToast = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 3000);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setUsers(users.filter((user) => user._id !== id));
//       showToast("User deleted successfully", "success");
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setIsEditing(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedUsers = users.map((u) =>
//       u._id === editingUser._id ? editingUser : u
//     );
//     setUsers(updatedUsers);
//     setIsEditing(false);
//     showToast("User updated successfully", "success");
//   };

//   const filteredUsers = users
//     .filter((user) =>
//       filterRole === "all" ? true : user.role === filterRole
//     )
//     .filter(
//       (user) =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div className="p-6">
//       {/* ✅ Toast Component */}
//       <Toast visible={toastVisible} message={toastMessage} type={toastType} />

//       <h1 className="text-3xl font-bold mb-6 text-black">Users Management</h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={filterRole}
//           onChange={(e) => setFilterRole(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         >
//           <option value="all">All Roles</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-gray-800">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-center">Role</th>
//               <th className="py-3 px-4 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="py-3 px-4">{user.name}</td>
//                   <td className="py-3 px-4">{user.email}</td>
//                   <td className="py-3 px-4 text-center font-medium text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full ${
//                         user.role === "admin"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-blue-100 text-blue-700"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                         title="Edit user"
//                       >
//                         <FaEdit /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user._id)}
//                         className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                         title="Delete user"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-6 text-gray-500">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setIsEditing(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit User
//             </h3>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveEdit();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.name}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, name: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, email: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Role:
//                 </label>
//                 <select
//                   value={editingUser.role}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, role: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="flex justify-between mt-6">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersList;

// ----------------------------- كود كامل -----------------------------
// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const token = localStorage.getItem("token"); // تأكد من الحصول على التوكن من المكان المناسب

//   useEffect(() => {
//     // التحقق من وجود التوكن قبل إرسال الطلب
//     if (!token) {
//       console.error("No token found!");
//       return;
//     }

//     fetch("https://bakeryproject-1onw.onrender.com/api/admin/users", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           // إذا كان الرد غير صالح (مثل 403 أو 401)
//           throw new Error(`Error: ${response.status} - ${response.statusText}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setUsers(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error.message);
//       });
//   }, [token]);

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setUsers(users.filter((user) => user._id !== id));
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setIsEditing(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedUsers = users.map((u) =>
//       u._id === editingUser._id ? editingUser : u
//     );
//     setUsers(updatedUsers);
//     setIsEditing(false);
//   };

//   const filteredUsers = users
//     .filter((user) =>
//       filterRole === "all" ? true : user.role === filterRole
//     )
//     .filter(
//       (user) =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-black">Users Management</h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={filterRole}
//           onChange={(e) => setFilterRole(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         >
//           <option value="all">All Roles</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-gray-800">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-center">Role</th>
//               <th className="py-3 px-4 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="py-3 px-4">{user.name}</td>
//                   <td className="py-3 px-4">{user.email}</td>
//                   <td className="py-3 px-4 text-center font-medium text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full ${
//                         user.role === "admin"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-blue-100 text-blue-700"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                         title="Edit user"
//                       >
//                         <FaEdit /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user._id)}
//                         className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                         title="Delete user"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-6 text-gray-500">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for Editing */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setIsEditing(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit User
//             </h3>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveEdit();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.name}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, name: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, email: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Role:
//                 </label>
//                 <select
//                   value={editingUser.role}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, role: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="flex justify-between mt-6">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersList;


// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
  
//   // التوكن الذي سيتم إضافته للمطالبة
//   const token = "your-token-here"; // استبدل هذا بالتوكن الحقيقي

//   // جلب البيانات من الـ API عند تحميل المكون
//   useEffect(() => {
//     fetch("https://bakeryproject-1onw.onrender.com/api/admin/users", {
//       method: "GET", // تحديد طريقة الطلب (GET)
//       headers: {
//         "Content-Type": "application/json", // تحديد نوع المحتوى
//         Authorization: `Bearer ${token}`, // إضافة التوكن في الهيدر
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         // تأكد من أن البيانات قد وصلت بشكل صحيح قبل تعيينها في الحالة
//         setUsers(data);
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//       });
//   }, [token]); // استخدام التوكن في الطلب عند تحميل المكون

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setUsers(users.filter((user) => user._id !== id));
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setIsEditing(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedUsers = users.map((u) =>
//       u._id === editingUser._id ? editingUser : u
//     );
//     setUsers(updatedUsers);
//     setIsEditing(false);
//   };

//   const filteredUsers = users
//     .filter((user) =>
//       filterRole === "all" ? true : user.role === filterRole
//     )
//     .filter(
//       (user) =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-black">Users Management</h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={filterRole}
//           onChange={(e) => setFilterRole(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         >
//           <option value="all">All Roles</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-gray-800">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-center">Role</th>
//               <th className="py-3 px-4 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="py-3 px-4">{user.name}</td>
//                   <td className="py-3 px-4">{user.email}</td>
//                   <td className="py-3 px-4 text-center font-medium text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full ${
//                         user.role === "admin"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-blue-100 text-blue-700"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() => handleEdit(user)}
//                         className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                         title="Edit user"
//                       >
//                         <FaEdit /> Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user._id)}
//                         className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                         title="Delete user"
//                       >
//                         <FaTrash /> Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="text-center py-6 text-gray-500">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setIsEditing(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit User
//             </h3>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveEdit();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.name}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, name: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, email: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Role:
//                 </label>
//                 <select
//                   value={editingUser.role}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, role: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="flex justify-between mt-6">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersList;
// --------------------كود كامل-----------------------


// ------------------------------------------------
// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const dummyUsers = [
//       {
//         _id: "1",
//         name: "Ahmed Mohamed",
//         email: "ahmed@example.com",
//         role: "user",
//         isActive: true,
//       },
//       {
//         _id: "2",
//         name: "Sara Ali",
//         email: "sara@example.com",
//         role: "admin",
//         isActive: false,
//       },
//       {
//         _id: "3",
//         name: "Mohamed Hossam",
//         email: "mohamed@example.com",
//         role: "user",
//         isActive: true,
//       },
//     ];
//     setUsers(dummyUsers);
//   }, []);

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       setUsers(users.filter((user) => user._id !== id));
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setIsEditing(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedUsers = users.map((u) =>
//       u._id === editingUser._id ? editingUser : u
//     );
//     setUsers(updatedUsers);
//     setIsEditing(false);
//   };

//   const toggleActivation = (id) => {
//     const updatedUsers = users.map((u) =>
//       u._id === id ? { ...u, isActive: !u.isActive } : u
//     );
//     setUsers(updatedUsers);
//   };

//   const filteredUsers = users
//     .filter((user) =>
//       filterRole === "all" ? true : user.role === filterRole
//     )
//     .filter(
//       (user) =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-black">Users Management</h1>

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />
//         <select
//           value={filterRole}
//           onChange={(e) => setFilterRole(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         >
//           <option value="all">All Roles</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-gray-800">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-3 px-4 text-left">Name</th>
//               <th className="py-3 px-4 text-left">Email</th>
//               <th className="py-3 px-4 text-center">Role</th>
//               <th className="py-3 px-4 text-center">Status</th>
//               <th className="py-3 px-4 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b hover:bg-gray-50 transition"
//                 >
//                   <td className="py-3 px-4">{user.name}</td>
//                   <td className="py-3 px-4">{user.email}</td>
//                   <td className="py-3 px-4 text-center font-medium text-sm">
//                     <span
//                       className={`px-2 py-1 rounded-full ${
//                         user.role === "admin"
//                           ? "bg-red-100 text-red-700"
//                           : "bg-blue-100 text-blue-700"
//                       }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4 text-center text-sm">
//                     {user.isActive ? (
//                       <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full">
//                         Active
//                       </span>
//                     ) : (
//                       <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full">
//                         Inactive
//                       </span>
//                     )}
//                   </td>
//                   <td className="py-3 px-4 text-center">
//                     <div className="flex justify-center gap-2">
//                     <button
//   onClick={() => handleEdit(user)}
//   className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//   title="Edit user"
// >
//   <FaEdit /> Edit
// </button>
// <button
//   onClick={() => handleDelete(user._id)}
//   className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//   title="Delete user"
// >
//   <FaTrash /> Delete
// </button>
// <button
//   onClick={() => toggleActivation(user._id)}
//   className={`flex items-center gap-1 py-1 px-2 rounded text-xs text-white ${
//     user.isActive
//       ? "bg-yellow-600 hover:bg-yellow-700"
//       : "bg-green-600 hover:bg-green-700"
//   }`}
//   title={user.isActive ? "Deactivate user" : "Activate user"}
// >
//   {user.isActive ? <FaToggleOff /> : <FaToggleOn />}{" "}
//   {user.isActive ? "Deactivate" : "Activate"}
// </button>

//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-6 text-gray-500">
//                   No users found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setIsEditing(false)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit User
//             </h3>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSaveEdit();
//               }}
//             >
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Name:
//                 </label>
//                 <input
//                   type="text"
//                   value={editingUser.name}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, name: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Email:
//                 </label>
//                 <input
//                   type="email"
//                   value={editingUser.email}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, email: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Role:
//                 </label>
//                 <select
//                   value={editingUser.role}
//                   onChange={(e) =>
//                     setEditingUser({ ...editingUser, role: e.target.value })
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>

//               <div className="mb-4">
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={editingUser.isActive}
//                     onChange={(e) =>
//                       setEditingUser({
//                         ...editingUser,
//                         isActive: e.target.checked,
//                       })
//                     }
//                     className="mr-2"
//                   />
//                   Active
//                 </label>
//               </div>

//               <div className="flex justify-between mt-6">
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersList;


// import React, { useState, useEffect } from 'react';
// import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

// // Reusable IconButton component
// const IconButton = ({ onClick, icon, label, title, hoverColor }) => (
//   <button
//     onClick={onClick}
//     title={title}
//     className={`flex items-center gap-1 px-3 py-1 rounded text-sm text-white ${hoverColor} hover:opacity-90`}
//   >
//     {icon}
//     {label}
//   </button>
// );

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [filterRole, setFilterRole] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const dummyUsers = [
//       { _id: '1', name: 'Ahmed Mohamed', email: 'ahmed@example.com', role: 'user', isActive: true },
//       { _id: '2', name: 'Sara Ali', email: 'sara@example.com', role: 'admin', isActive: false },
//       { _id: '3', name: 'Mohamed Hossam', email: 'mohamed@example.com', role: 'user', isActive: true },
//     ];
//     setUsers(dummyUsers);
//   }, []);

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       setUsers(users.filter(user => user._id !== id));
//     }
//   };

//   const handleEdit = (user) => {
//     setEditingUser(user);
//     setIsEditing(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedUsers = users.map(u =>
//       u._id === editingUser._id ? editingUser : u
//     );
//     setUsers(updatedUsers);
//     setIsEditing(false);
//   };

//   const toggleActivation = (id) => {
//     const updatedUsers = users.map(u =>
//       u._id === id ? { ...u, isActive: !u.isActive } : u
//     );
//     setUsers(updatedUsers);
//   };

//   const filteredUsers = users
//     .filter(user => (filterRole === 'all' ? true : user.role === filterRole))
//     .filter(user =>
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 bg-white shadow-md rounded-lg">
//       <h2 className="text-3xl font-bold mb-6 text-center text-pink-700">Users List 👥</h2>

//       {/* Search & Filter */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="🔍 Search by name or email..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full md:w-2/3 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
//         />
//         <select
//           value={filterRole}
//           onChange={(e) => setFilterRole(e.target.value)}
//           className="w-full md:w-1/3 border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
//         >
//           <option value="all">All Roles</option>
//           <option value="user">User</option>
//           <option value="admin">Admin</option>
//         </select>
//       </div>

//       {/* Users Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-md">
//           <thead className="bg-pink-600 text-white">
//             <tr>
//               <th className="px-4 py-3 text-left">Name</th>
//               <th className="px-4 py-3 text-left">Email</th>
//               <th className="px-4 py-3 text-left">Role</th>
//               <th className="px-4 py-3 text-left">Status</th>
//               <th className="px-4 py-3 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredUsers.length > 0 ? (
//               filteredUsers.map(user => (
//                 <tr key={user._id} className="border-b hover:bg-gray-50">
//                   <td className="px-4 py-3">{user.name}</td>
//                   <td className="px-4 py-3">{user.email}</td>
//                   <td className="px-4 py-3">
//                     <span className={`font-semibold ${user.role === 'admin' ? 'text-red-500' : 'text-blue-600'}`}>
//                       {user.role === 'admin' ? 'Admin' : 'User'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3">
//                     <span className={`font-semibold ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
//                       {user.isActive ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 flex flex-wrap gap-2">
//                     <IconButton
//                       onClick={() => handleEdit(user)}
//                       icon={<FaEdit />}
//                       label="Edit"
//                       title="Edit user"
//                       hoverColor="bg-yellow-500"
//                     />
//                     <IconButton
//                       onClick={() => handleDelete(user._id)}
//                       icon={<FaTrash />}
//                       label="Delete"
//                       title="Delete user"
//                       hoverColor="bg-red-500"
//                     />
//                     <IconButton
//                       onClick={() => toggleActivation(user._id)}
//                       icon={user.isActive ? <FaToggleOff /> : <FaToggleOn />}
//                       label={user.isActive ? 'Deactivate' : 'Activate'}
//                       title={user.isActive ? 'Deactivate user' : 'Activate user'}
//                       hoverColor={user.isActive ? 'bg-yellow-500' : 'bg-green-600'}
//                     />
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center py-6 text-gray-500">
//                   No users to display.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {isEditing && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-bold mb-4 text-center">✏️ Edit User</h3>

//             <input
//               type="text"
//               value={editingUser.name}
//               onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
//               placeholder="Name"
//               className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
//             />

//             <input
//               type="email"
//               value={editingUser.email}
//               onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
//               placeholder="Email"
//               className="w-full mb-4 p-2 border rounded-md focus:ring-2 focus:ring-pink-400 outline-none"
//             />

//             <select
//               value={editingUser.role}
//               onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
//               className="w-full mb-4 p-2 border rounded-md"
//             >
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>

//             <label className="flex items-center mb-4 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={editingUser.isActive}
//                 onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
//                 className="mr-2"
//               />
//               <span>Active</span>
//             </label>

//             <div className="flex justify-between mt-6">
//               <button
//                 onClick={() => setIsEditing(false)}
//                 className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveEdit}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersList;

