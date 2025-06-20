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

  // صفحة الحالية لل pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const token = localStorage.getItem("authToken");

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

  // تطبيق الفلاتر والبحث
  const filteredUsers = users
    .filter((user) =>
      filterRole === "all" ? true : user.role === filterRole
    )
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // حساب عدد الصفحات الكلي
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // حساب المستخدمين الذين سيتم عرضهم حسب الصفحة الحالية
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6">
      {/* Toast Component */}
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <h1 className="text-3xl font-bold mb-6 text-pink-700">Users Management</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Field */}
        <Select
          inputValue={searchTerm}
          onInputChange={(newValue) => {
            setSearchTerm(newValue);
            setCurrentPage(1); // إعادة تعيين الصفحة عند البحث
          }}
          className="w-full"
          styles={customStyles}
          placeholder="Search by name or email..."
          isClearable
        />

        {/* Role Filter */}
        <Select
          value={filterRole ? { label: filterRole, value: filterRole } : null}
          onChange={(opt) => {
            setFilterRole(opt ? opt.value : "all");
            setCurrentPage(1); // إعادة تعيين الصفحة عند الفلترة
          }}
          options={[
            { label: "All Roles", value: "all" },
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
          ]}
          styles={customStyles}
          placeholder="Filter by Role"
          isClearable
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
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
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
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
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

      {/* Pagination Buttons */}
      {filteredUsers.length > 0 && (
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

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
            {/* <button
              onClick={() => setIsEditing(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button> */}

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

              <div className="mb-4 flex justify-between gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
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
// import Select from "react-select";

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [filterRole, setFilterRole] = useState("all");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const token = localStorage.getItem("authToken");

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

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? "#f472b6" : "#ccc",
//       boxShadow: state.isFocused ? "0 0 0 1px #f472b6" : "none",
//       "&:hover": {
//         borderColor: "#f472b6",
//       },
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused ? "#fbcfe8" : "#fff",
//       color: "#000",
//     }),
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
//       {/*Toast Component */}
//       <Toast visible={toastVisible} message={toastMessage} type={toastType} />

//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Users Management</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         {/* Search Field */}
//         <Select
//           inputValue={searchTerm}
//           onInputChange={(newValue) => setSearchTerm(newValue)}
//           className="w-full"
//           styles={customStyles}
//           placeholder="Search by name or email..."
//         />

//         {/* Role Filter */}
//         <Select
//           value={filterRole ? { label: filterRole, value: filterRole } : null}
//           onChange={(opt) => setFilterRole(opt ? opt.value : "all")}
//           options={[
//             { label: "All Roles", value: "all" },
//             { label: "User", value: "user" },
//             { label: "Admin", value: "admin" },
//           ]}
//           styles={customStyles}
//           placeholder="Filter by Role"
//         />
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
//                         className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
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
//                   disabled
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
//                   disabled
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

