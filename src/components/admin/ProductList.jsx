import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Toast from "./Toast"; // استيراد مكون التوست
// import { FaSearch } from "react-icons/fa";
import Select from "react-select";


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [offerFilter, setOfferFilter] = useState(""); // "", "on", "off"

  const token = localStorage.getItem("authToken");

  const sortLabels = {
    nameAsc: "Name (A-Z)",
    nameDesc: "Name (Z-A)",
    priceAsc: "Price (Low to High)",
    priceDesc: "Price (High to Low)",
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://bakeryproject-1onw.onrender.com/api/products/all"
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleEdit = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    setSelectedProduct(productToEdit);
    setEditedProduct(productToEdit);
  };

  const handleDelete = async (id) => {
    if (!token) {
      showToast("You must be logged in to delete a product.", "error");
      return;
    }

    try {
      const response = await fetch(
        `https://bakeryproject-1onw.onrender.com/api/products/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
        showToast("Successfully deleted the product.");
      } else {
        showToast("Failed to delete the product.", "error");
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast("An error occurred while deleting.", "error");
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!token) {
      showToast("You must be logged in to update a product.", "error");
      return;
    }

    try {
      const response = await fetch(
        `https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedProduct),
        }
      );

      if (response.ok) {
        const updated = await response.json();
        setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
        setSelectedProduct(null);
        showToast("Successfully updated the product.");
      } else {
        showToast("Failed to update the product.", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showToast("An error occurred while updating.", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter
      ? product.category === categoryFilter
      : true;

    const matchesOffer =
      offerFilter === "on"
        ? product.offer?.isOnSale === true
        : offerFilter === "off"
        ? !product.offer?.isOnSale
        : true;

    return matchesSearch && matchesCategory && matchesOffer;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "nameAsc":
        return a.name.localeCompare(b.name);
      case "nameDesc":
        return b.name.localeCompare(a.name);
      case "priceAsc":
        return a.price - b.price;
      case "priceDesc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const uniqueCategories = [...new Set(products.map((p) => p.category))];

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
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Product List</h1>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-pink-400"
        />
        <Select
          value={
            categoryFilter
              ? { label: categoryFilter, value: categoryFilter }
              : { label: "All Categories", value: "" }
          }
          onChange={(selectedOption) =>
            setCategoryFilter(selectedOption ? selectedOption.value : "")
          }
          options={[
            { label: "All", value: "" }, // 👈 خيار "الكل"
            ...uniqueCategories.map((cat) => ({ label: cat, value: cat })),
          ]}
          styles={customStyles}
          placeholder="Select category"
        />

        <Select
          value={
            sortOption
              ? { label: sortLabels[sortOption], value: sortOption }
              : { label: "Sort by", value: "" }
          }
          onChange={(selectedOption) =>
            setSortOption(selectedOption ? selectedOption.value : "")
          }
          options={[
            { label: "All", value: "" }, // 👈 خيار "الكل"
            { label: "Name (A-Z)", value: "nameAsc" },
            { label: "Name (Z-A)", value: "nameDesc" },
            { label: "Price (Low to High)", value: "priceAsc" },
            { label: "Price (High to Low)", value: "priceDesc" },
          ]}
          styles={customStyles}
          placeholder="Sort by"
        />
        <Select
          value={
            offerFilter
              ? {
                  label: offerFilter === "on" ? "On Sale" : "No Offer",
                  value: offerFilter,
                }
              : { label: "All Offers", value: "" }
          }
          onChange={(selectedOption) =>
            setOfferFilter(selectedOption ? selectedOption.value : "")
          }
          options={[
            { label: "All Offers", value: "" },
            { label: "On Sale", value: "on" },
            { label: "No Offer", value: "off" },
          ]}
          styles={customStyles}
          placeholder="Filter by Offer"
        />
      </div>
      {/* Table */}
      <div className="table-s overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="table min-w-full bg-white text-sm text-gray-800">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Image</th>
              {/* <th className="py-3 px-4">ID</th> */}
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4">Offer</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr key={product._id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4 text-center">
                  {index + 1 + (currentPage - 1) * productsPerPage}
                </td>
                <td className="py-3 px-4 text-center">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded aspect-square"
                  />
                </td>
                {/* <td className="py-3 px-4 text-xs text-center">{product._id}</td> */}
                <td className="py-3 px-4 font-medium text-center">
                  {product.name}
                </td>
                <td className="py-3 px-4 text-center">{product.price} EGP</td>
                <td className="py-3 px-4 text-center">{product.category}</td>
                <td className="py-3 px-4 text-xs max-w-xs overflow-hidden">
                  {product.description.length > 50
                    ? `${product.description.slice(0, 50)}...`
                    : product.description}
                </td>

                {/* 👈 أضف هذا العمود لكل منتج */}
                <td className="py-3 px-4 text-center">
                  {product.availability ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                      Available
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                      Unavailable
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {product.offer?.isOnSale ? (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {product.offer.discountPercentage}% OFF
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                      No Offer
                    </span>
                  )}
                </td>

                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(product._id)}
                      className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No matching products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
          disabled={currentPage === 1}
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
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      {/* Toast Notification */}
      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
      Edit Modal
      {/* {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="scroll bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>
            <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
              Edit Product
            </h3>
            <div className="overflow-y-auto max-h-[50px]">
              {" "}
              <form onSubmit={handleUpdateProduct}>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Product Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Price:
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Category:
                  </label>
                  <select
                    name="category"
                    value={editedProduct.category || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  >
                    <option value="">Select a category</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Availability:
                  </label>
                  <select
                    name="availability"
                    value={editedProduct.availability}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  >
                    <option value={true}>Available</option>
                    <option value={false}>Unavailable</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    value={editedProduct.description || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                    rows={4}
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Is On Sale:
                  </label>
                  <select
                    name="offer.isOnSale"
                    value={editedProduct.offer?.isOnSale ?? false}
                    onChange={(e) =>
                      setEditedProduct((prev) => ({
                        ...prev,
                        offer: {
                          ...prev.offer,
                          isOnSale: e.target.value === "true",
                        },
                      }))
                    }
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Discount Percentage:
                  </label>
                  <input
                    type="number"
                    name="offer.discountPercentage"
                    value={editedProduct.offer?.discountPercentage ?? ""}
                    onChange={(e) =>
                      setEditedProduct((prev) => ({
                        ...prev,
                        offer: {
                          ...prev.offer,
                          discountPercentage: parseInt(e.target.value) || 0,
                        },
                      }))
                    }
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  />
                </div>

                <div className="mb-4">
                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="scroll bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>
            <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
              Edit Product
            </h3>
            <div className="overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleUpdateProduct}>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Product Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Price:
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Category:
                  </label>
                  <Select
                    value={
                      editedProduct.category
                        ? {
                            label: editedProduct.category,
                            value: editedProduct.category,
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      setEditedProduct((prev) => ({
                        ...prev,
                        category: selectedOption?.value || "",
                      }))
                    }
                    options={uniqueCategories.map((cat) => ({
                      label: cat,
                      value: cat,
                    }))}
                    styles={customStyles}
                    placeholder="Select category"
                  />
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Availability:
                  </label>
                  <Select
                    value={{
                      label: editedProduct.availability
                        ? "Available"
                        : "Unavailable",
                      value: editedProduct.availability,
                    }}
                    onChange={(selectedOption) =>
                      setEditedProduct((prev) => ({
                        ...prev,
                        availability:
                          selectedOption.value === true ||
                          selectedOption.value === "true",
                      }))
                    }
                    options={[
                      { label: "Available", value: true },
                      { label: "Unavailable", value: false },
                    ]}
                    styles={customStyles}
                    placeholder="Select availability"
                  />
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Description:
                  </label>
                  <textarea
                    name="description"
                    value={editedProduct.description || ""}
                    onChange={handleChange}
                    className="border p-2 rounded w-full focus:outline-pink-400"
                    rows={4}
                  />
                </div>

                {/* Is On Sale */}
                {/* Is On Sale */}
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700 font-semibold">
                    Is On Sale:
                  </label>
                  <Select
                    value={{
                      label: editedProduct.offer?.isOnSale ? "Yes" : "No",
                      value: editedProduct.offer?.isOnSale,
                    }}
                    onChange={(selectedOption) =>
                      setEditedProduct((prev) => ({
                        ...prev,
                        offer: {
                          ...(prev.offer || {}),
                          isOnSale:
                            selectedOption.value === true ||
                            selectedOption.value === "true",
                        },
                      }))
                    }
                    options={[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ]}
                    styles={customStyles}
                    placeholder="Is on sale?"
                    isDisabled={!editedProduct.offer?.isOnSale} // ✅ تعطيل الحقل إذا لم يكن On Sale
                  />
                </div>

                {/* Discount Percentage */}
                {/* <div className="mb-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              Discount Percentage:
            </label>
            <input
              type="number"
              name="offer.discountPercentage"
              value={editedProduct.offer?.discountPercentage ?? ""}
              onChange={(e) =>
                setEditedProduct((prev) => ({
                  ...prev,
                  offer: {
                    ...prev.offer,
                    discountPercentage:
                      parseInt(e.target.value) || 0,
                  },
                }))
              }
              className="border p-2 rounded w-full focus:outline-pink-400"
            />
          </div> */}

                {/* Submit */}
                <div className="mb-4">
                  <button
                    type="submit"
                    className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;



