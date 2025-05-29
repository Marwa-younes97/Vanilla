import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaSave, FaTimes, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Toast from "./Toast"; // استيراد التوست المخصص

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");

  // حالات التوست
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // استخدام useCallback للحفاظ على ثبات دالة fetchCategories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://bakeryproject-1onw.onrender.com/api/products/all"
      );
      const products = response.data;
      const uniqueCategories = [
        ...new Set(products.map((product) => product.category)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Failed to load categories!", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // إضافة fetchCategories كـ dependency هنا

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) {
      showToast("Category is empty or already exists!", "error");
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategory("");
    showToast("Category added successfully!", "success");
  };

  const handleDeleteCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
    showToast("Category deleted.", "success");
  };

  const handleEditCategory = (index, currentName) => {
    setEditIndex(index);
    setEditedCategory(currentName);
  };

  const handleSaveEdit = (index) => {
    if (editedCategory.trim()) {
      const updated = [...categories];
      updated[index] = editedCategory.trim();
      setCategories(updated);
      setEditIndex(null);
      setEditedCategory("");
      showToast("Category updated.", "success");
    } else {
      showToast("Category name cannot be empty.", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditedCategory("");
  };

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IconButton = ({ icon, label, onClick, title, hoverColor = "text-pink-600" }) => (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1 text-gray-600 hover:${hoverColor} transition duration-150 text-sm font-medium`}
    >
      <span className="text-lg">{icon}</span>
      {label && <span>{label}</span>}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-tr from-white to-gray-100 rounded-xl shadow-lg">
      {/* عرض التوست */}
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        🗂️ Category Management
      </h1>

      {/* إضافة تصنيف */}
      <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter new category..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-500 outline-none"
        />
        <button
          onClick={handleAddCategory}
          className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-md transition shadow-md"
        >
          <FaPlus /> <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* البحث */}
      <div className="mb-6">
        <input
          type="text"
          placeholder=" Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-pink-400 outline-none"
        />
      </div>

      {/* عرض التصنيفات */}
      {loading ? (
        <div className="text-center text-gray-600">Loading categories...</div>
      ) : (
        <div className="overflow-x-auto">
          {filteredCategories.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden">
              <thead className="bg-pink-100 text-pink-800">
                <tr>
                  <th className="py-3 px-4 border-b text-left">📁 Category Name</th>
                  <th className="py-3 px-4 border-b text-left">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="py-2 px-4 border-b">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedCategory}
                          onChange={(e) => setEditedCategory(e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1 w-full"
                        />
                      ) : (
                        <span className="text-gray-800">{category}</span>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {editIndex === index ? (
                        <div className="flex gap-3">
                          <IconButton
                            onClick={() => handleSaveEdit(index)}
                            icon={<FaSave />}
                            label="Save"
                            title="Save"
                            hoverColor="text-blue-500"
                          />
                          <IconButton
                            onClick={handleCancelEdit}
                            icon={<FaTimes />}
                            label="Cancel"
                            title="Cancel"
                            hoverColor="text-gray-500"
                          />
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <IconButton
                            onClick={() => handleEditCategory(index, category)}
                            icon={<FaEdit />}
                            label="Edit"
                            title="Edit"
                            hoverColor="text-yellow-500"
                          />
                          <IconButton
                            onClick={() => handleDeleteCategory(category)}
                            icon={<FaTrash />}
                            label="Delete"
                            title="Delete"
                            hoverColor="text-red-500"
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-gray-500 py-6">No categories found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
