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

// ---------------------------------------
// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";
// import Toast from "./Toast"; // استيراد مكون التوست

// import Select from "react-select";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(20);
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   const token = localStorage.getItem("token");

//   const sortLabels = {
//     nameAsc: "Name (A-Z)",
//     nameDesc: "Name (Z-A)",
//     priceAsc: "Price (Low to High)",
//     priceDesc: "Price (High to Low)",
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(
//           "https://bakeryproject-1onw.onrender.com/api/products/all"
//         );
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const showToast = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 3000);
//   };

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit);
//   };

//   const handleDelete = async (id) => {
//     if (!token) {
//       showToast("You must be logged in to delete a product.", "error");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://bakeryproject-1onw.onrender.com/api/products/${id}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//         showToast("Successfully deleted the product.");
//       } else {
//         showToast("Failed to delete the product.", "error");
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       showToast("An error occurred while deleting.", "error");
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       showToast("You must be logged in to update a product.", "error");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(editedProduct),
//         }
//       );

//       if (response.ok) {
//         const updated = await response.json();
//         setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
//         setSelectedProduct(null);
//         showToast("Successfully updated the product.");
//       } else {
//         showToast("Failed to update the product.", "error");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       showToast("An error occurred while updating.", "error");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter
//       ? product.category === categoryFilter
//       : true;
//     return matchesSearch && matchesCategory;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortOption) {
//       case "nameAsc":
//         return a.name.localeCompare(b.name);
//       case "nameDesc":
//         return b.name.localeCompare(a.name);
//       case "priceAsc":
//         return a.price - b.price;
//       case "priceDesc":
//         return b.price - a.price;
//       default:
//         return 0;
//     }
//   });

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = sortedProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
//   const uniqueCategories = [...new Set(products.map((p) => p.category))];

//   // ⭐ تخصيص ألوان الـ Select
//   const customStyles = {
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused
//         ? "#fbcfe8" // اللون عند الـ hover
//         : "white", // لا يوجد لون عند التحديد
//       color: "black",
//     }),
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? "#f472b6" : "#ccc", // تغيير اللون عند التركيز
//       boxShadow: state.isFocused ? "0 0 0 1px #f472b6" : "none", // الظل عند التركيز
//       "&:hover": {
//         borderColor: "#f472b6", // اللون عند الـ hover
//       },
//     }),
//     menu: (provided) => ({
//       ...provided,
//       border: "none", // إزالة الحدود حول القائمة
//       borderRadius: "0.375rem",
//       marginTop: "2px",
//     }),
//     menuList: (provided) => ({
//       ...provided,
//       padding: 0,
//     }),
//     clearIndicator: (provided) => ({
//       ...provided,
//       display: "none", // إخفاء علامة "X"
//     }),
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Product List</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         />
//         <Select
//           value={
//             categoryFilter
//               ? { label: categoryFilter, value: categoryFilter }
//               : { label: "All", value: "" }
//           }
//           onChange={(selectedOption) =>
//             setCategoryFilter(selectedOption ? selectedOption.value : "")
//           }
//           options={[
//             { label: "All", value: "" }, // 👈 خيار "الكل"
//             ...uniqueCategories.map((cat) => ({ label: cat, value: cat })),
//           ]}
//           styles={customStyles}
//           placeholder="Select category"
//         />

//         <Select
//           value={
//             sortOption
//               ? { label: sortLabels[sortOption], value: sortOption }
//               : { label: "All", value: "" }
//           }
//           onChange={(selectedOption) =>
//             setSortOption(selectedOption ? selectedOption.value : "")
//           }
//           options={[
//             { label: "All", value: "" }, // 👈 خيار "الكل"
//             { label: "Name (A-Z)", value: "nameAsc" },
//             { label: "Name (Z-A)", value: "nameDesc" },
//             { label: "Price (Low to High)", value: "priceAsc" },
//             { label: "Price (High to Low)", value: "priceDesc" },
//           ]}
//           styles={customStyles}
//           placeholder="Sort by"
//         />
//       </div>

//       {/* Table */}
//       <div className="table-s overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="table min-w-full bg-white text-sm text-gray-800">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-4">#</th>
//               <th className="py-3 px-4">Image</th>
//               {/* <th className="py-3 px-4">ID</th> */}
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Description</th>
//               <th className="py-3 px-4">Availability</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts.map((product, index) => (
//               <tr key={product._id} className="border-t hover:bg-gray-50">
//                 <td className="py-3 px-4 text-center">
//                   {index + 1 + (currentPage - 1) * productsPerPage}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-8 h-8 object-cover rounded aspect-square"
//                   />
//                 </td>
//                 {/* <td className="py-3 px-4 text-xs text-center">{product._id}</td> */}
//                 <td className="py-3 px-4 font-medium text-center">
//                   {product.name}
//                 </td>
//                 <td className="py-3 px-4 text-center">{product.price} EGP</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-xs max-w-xs overflow-hidden">
//                   {product.description.length > 50
//                     ? `${product.description.slice(0, 50)}...`
//                     : product.description}
//                 </td>

//                 {/* 👈 أضف هذا العمود لكل منتج */}
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
//                       Available
//                     </span>
//                   ) : (
//                     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
//                       Unavailable
//                     </span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEdit(product._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {currentProducts.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-500">
//                   No matching products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-6 mt-6">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() =>
//             setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//           }
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Toast Notification */}
//       <Toast message={toastMessage} visible={toastVisible} type={toastType} />

//       {/* Edit Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit Product
//             </h3>
//             <form onSubmit={handleUpdateProduct}>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Product Name:
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Price:
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Category:
//                 </label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">Select a category</option>
//                   {uniqueCategories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Availability:
//                 </label>
//                 <select
//                   name="availability"
//                   value={editedProduct.availability}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value={true}>Available</option>
//                   <option value={false}>Unavailable</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Description:
//                 </label>
//                 <textarea
//                   name="description"
//                   value={editedProduct.description || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                   rows={4}
//                 />
//               </div>

//               <div className="mb-4">
//                 <button
//                   type="submit"
//                   className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// --------------------------------------- كامل ---------------------
// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(20);
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch(
//           "https://bakeryproject-1onw.onrender.com/api/products/all"
//         );
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit);
//   };

//   const handleDelete = async (id) => {
//     if (!token) {
//       alert("You must be logged in to delete a product.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://bakeryproject-1onw.onrender.com/api/products/${id}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//         setToastMessage("Successfully deleted the product.");
//         setToastVisible(true);
//         setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
//       } else {
//         console.error("Failed to delete the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while deleting the product:", error);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       alert("You must be logged in to update a product.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(editedProduct),
//         }
//       );

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setProducts(
//           products.map((p) =>
//             p._id === updatedProduct._id ? updatedProduct : p
//           )
//         );
//         setSelectedProduct(null);
//         setToastMessage("Successfully updated the product.");
//         setToastVisible(true);
//         setTimeout(() => setToastVisible(false), 3000); // Hide toast after 3 seconds
//       } else {
//         console.error("Failed to update the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while updating the product:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter
//       ? product.category === categoryFilter
//       : true;
//     return matchesSearch && matchesCategory;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortOption) {
//       case "nameAsc":
//         return a.name.localeCompare(b.name);
//       case "nameDesc":
//         return b.name.localeCompare(a.name);
//       case "priceAsc":
//         return a.price - b.price;
//       case "priceDesc":
//         return b.price - a.price;
//       default:
//         return 0;
//     }
//   });

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = sortedProducts.slice(
//     indexOfFirstProduct,
//     indexOfLastProduct
//   );
//   const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
//   const uniqueCategories = [...new Set(products.map((p) => p.category))];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Product List</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         />
//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         >
//           <option value="">Sort by</option>
//           <option value="nameAsc">Name (A-Z)</option>
//           <option value="nameDesc">Name (Z-A)</option>
//           <option value="priceAsc">Price (Low to High)</option>
//           <option value="priceDesc">Price (High to Low)</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-sm text-gray-800">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-4">#</th>
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">ID</th>
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Availability</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts.map((product, index) => (
//               <tr key={product._id} className="border-t hover:bg-gray-50">
//                 <td className="py-3 px-4 text-center">
//                   {index + 1 + (currentPage - 1) * productsPerPage}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-16 h-16 object-cover rounded"
//                   />
//                 </td>
//                 <td className="py-3 px-4 text-xs text-center">{product._id}</td>
//                 <td className="py-3 px-4 font-medium text-center">
//                   {product.name}
//                 </td>
//                 <td className="py-3 px-4 text-center">{product.price} EGP</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
//                       Available
//                     </span>
//                   ) : (
//                     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
//                       Unavailable
//                     </span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEdit(product._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {currentProducts.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-500">
//                   No matching products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-6 mt-6">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() =>
//             setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//           }
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Toast Notification */}
//       {toastVisible && (
//         <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full">
//           <div className="border-4 border-green-600 bg-white text-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-8 h-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <p className="text-lg font-semibold text-green-600">{toastMessage}</p>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit Product
//             </h3>
//             <form onSubmit={handleUpdateProduct}>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Product Name:
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Price:
//                 </label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Category:
//                 </label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">Select a category</option>
//                   {uniqueCategories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">
//                   Availability:
//                 </label>
//                 <select
//                   name="availability"
//                   value={editedProduct.availability}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value={true}>Available</option>
//                   <option value={false}>Unavailable</option>
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <button
//                   type="submit"
//                   className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;
// ------------------------- كامل ---------------------------

// -------------------------------- without api ---------------------------------
// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(20);
//   const [uniqueCategories, setUniqueCategories] = useState([]);

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         setProducts(data);

//         // استخراج التصنيفات الفريدة من المنتجات
//         const categories = [...new Set(data.map((item) => item.category))];
//         setUniqueCategories(categories);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit);
//   };

//   const handleDelete = async (id) => {
//     if (!token) {
//       alert("You must be logged in to delete a product.");
//       return;
//     }

//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//       } else {
//         console.error("Failed to delete the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while deleting the product:", error);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();

//     if (!token) {
//       alert("You must be logged in to update a product.");
//       return;
//     }

//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(editedProduct),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
//         setSelectedProduct(null);
//       } else {
//         console.error("Failed to update the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while updating the product:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortOption) {
//       case "nameAsc":
//         return a.name.localeCompare(b.name);
//       case "nameDesc":
//         return b.name.localeCompare(a.name);
//       case "priceAsc":
//         return a.price - b.price;
//       case "priceDesc":
//         return b.price - a.price;
//       default:
//         return 0;
//     }
//   });

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Product List</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         />
//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         >
//           <option value="">Sort by</option>
//           <option value="nameAsc">Name (A-Z)</option>
//           <option value="nameDesc">Name (Z-A)</option>
//           <option value="priceAsc">Price (Low to High)</option>
//           <option value="priceDesc">Price (High to Low)</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-sm text-gray-800">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-4">#</th>
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">ID</th>
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Availability</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts.map((product, index) => (
//               <tr key={product._id} className="border-t hover:bg-gray-50">
//                 <td className="py-3 px-4 text-center">{index + 1 + (currentPage - 1) * productsPerPage}</td>
//                 <td className="py-3 px-4 text-center">
//                   <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
//                 </td>
//                 <td className="py-3 px-4 text-xs text-center">{product._id}</td>
//                 <td className="py-3 px-4 font-medium text-center">{product.name}</td>
//                 <td className="py-3 px-4 text-center">{product.price} EGP</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Available</span>
//                   ) : (
//                     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Unavailable</span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEdit(product._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {currentProducts.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-500">
//                   No matching products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-6 mt-6">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Edit Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">Edit Product</h3>
//             <form onSubmit={handleUpdateProduct}>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Product Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Price:</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Category:</label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">Select a category</option>
//                   {uniqueCategories.map((cat) => (
//                     <option key={cat} value={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Availability:</label>
//                 <select
//                   name="availability"
//                   value={editedProduct.availability}
//                   onChange={(e) =>
//                     setEditedProduct((prev) => ({
//                       ...prev,
//                       availability: e.target.value === "true",
//                     }))
//                   }
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="true">Available</option>
//                   <option value="false">Unavailable</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

//--------------------------- تصميم الثالث--------------------------
// import React, { useState, useEffect } from "react";
// import { FaEdit, FaTrash } from "react-icons/fa"; // أيقونات التعديل والحذف

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [productsPerPage] = useState(20);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${id}`, {
//         method: "DELETE",
//       });
//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//       } else {
//         console.error("Failed to delete the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while deleting the product:", error);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(editedProduct),
//       });
//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setProducts(products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
//         setSelectedProduct(null);
//       } else {
//         console.error("Failed to update the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while updating the product:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortOption) {
//       case "nameAsc":
//         return a.name.localeCompare(b.name);
//       case "nameDesc":
//         return b.name.localeCompare(a.name);
//       case "priceAsc":
//         return a.price - b.price;
//       case "priceDesc":
//         return b.price - a.price;
//       default:
//         return 0;
//     }
//   });

//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
//   const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
//   const uniqueCategories = [...new Set(products.map((p) => p.category))];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Product List</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         />
//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         >
//           <option value="">Sort by</option>
//           <option value="nameAsc">Name (A-Z)</option>
//           <option value="nameDesc">Name (Z-A)</option>
//           <option value="priceAsc">Price (Low to High)</option>
//           <option value="priceDesc">Price (High to Low)</option>
//         </select>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="min-w-full bg-white text-sm text-gray-800">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//               <th className="py-3 px-4">#</th>
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">ID</th>
//               <th className="py-3 px-4">Name</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Availability</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts.map((product, index) => (
//               <tr key={product._id} className="border-t hover:bg-gray-50">
//                 <td className="py-3 px-4 text-center">{index + 1 + (currentPage - 1) * productsPerPage}</td>
//                 <td className="py-3 px-4 text-center">
//                   <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
//                 </td>
//                 <td className="py-3 px-4 text-xs text-center">{product._id}</td>
//                 <td className="py-3 px-4 font-medium text-center">{product.name}</td>
//                 <td className="py-3 px-4 text-center">{product.price} EGP</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">Available</span>
//                   ) : (
//                     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Unavailable</span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEdit(product._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaEdit /> Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//             {currentProducts.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-500">
//                   No matching products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-6 mt-6">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Edit Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>
//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">Edit Product</h3>
//             <form onSubmit={handleUpdateProduct}>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Product Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Price:</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Category:</label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">Select a category</option>
//                   <option value="bead">Bead</option>
//                   <option value="tarts">Tarts</option>
//                   <option value="cakes">Cakes</option>
//                   <option value="cookies">Cookies</option>
//                 </select>
//               </div>
//               <button
//                 type="submit"
//                 className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// ---------------------- تصيميم الثاني ----------------------
// import React, { useState, useEffect } from "react";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [sortOption, setSortOption] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});

//   const [currentPage, setCurrentPage] = useState(1); // الصفحة الحالية
//   const [productsPerPage] = useState(20); // عدد المنتجات في كل صفحة

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//       } else {
//         console.error("Failed to delete the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while deleting the product:", error);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editedProduct),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setProducts(
//           products.map((product) =>
//             product._id === updatedProduct._id ? updatedProduct : product
//           )
//         );
//         setSelectedProduct(null);
//       } else {
//         console.error("Failed to update the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while updating the product:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   const sortedProducts = [...filteredProducts].sort((a, b) => {
//     switch (sortOption) {
//       case "nameAsc":
//         return a.name.localeCompare(b.name);
//       case "nameDesc":
//         return b.name.localeCompare(a.name);
//       case "priceAsc":
//         return a.price - b.price;
//       case "priceDesc":
//         return b.price - a.price;
//       default:
//         return 0;
//     }
//   });

//   // تحديد المنتجات التي سيتم عرضها بناءً على الصفحة الحالية
//   const indexOfLastProduct = currentPage * productsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   // عدد الصفحات الإجمالية
//   const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

//   const uniqueCategories = [...new Set(products.map((product) => product.category))];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-black">Product List</h1>

//       {/* Search, Filter, and Sort */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/3"
//         />

//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/3"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>

//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="sort-select border p-2 rounded w-full md:w-1/3"
//         >
//           <option value="">Sort by</option>
//           <option value="nameAsc">Name (A-Z)</option>
//           <option value="nameDesc">Name (Z-A)</option>
//           <option value="priceAsc">Price (Low to High)</option>
//           <option value="priceDesc">Price (High to Low)</option>
//         </select>
//       </div>

//       {/* Products Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700">
//               <th className="py-3 px-4">#</th> {/* رقم التسلسل */}
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">ID</th>
//               <th className="py-3 px-4">Product Name</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Availability</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProducts.map((product, index) => (
//               <tr key={product._id} className="border-b hover:bg-gray-50 transition">
//                 <td className="py-3 px-4 text-center">{index + 1 + (currentPage - 1) * productsPerPage}</td> {/* حساب الرقم التسلسلي */}
//                 <td className="py-6 px-8 text-center">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-40  object-cover rounded"
//                   />
//                 </td>
//                 <td className="py-3 px-4 text-center text-xs">{product._id}</td>
//                 <td className="py-3 px-4 text-center font-semibold">{product.name}</td>
//                 <td className="py-3 px-4 text-center">{product.price} EGP</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-sm">
//                       Available
//                     </span>
//                   ) : (
//                     <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-sm">
//                       Unavailable
//                     </span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//   <div className="flex justify-center gap-2">
//     <button
//       onClick={() => handleEdit(product._id)}
//       className="bg-black text-white text-sm py-1 px-2 rounded hover:bg-pink-600 w-20"
//     >
//       ✏️ Edit
//     </button>
//     <button
//       onClick={() => handleDelete(product._id)}
//       className="bg-black text-white text-sm py-1 px-2 rounded hover:bg-pink-600 w-20"
//     >
//       🗑 Delete
//     </button>
//   </div>
// </td>

//               </tr>
//             ))}
//             {currentProducts.length === 0 && (
//               <tr>
//                 <td colSpan="8" className="text-center py-6 text-gray-500">
//                   No matching products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-between items-center mt-4">
//         <button
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:bg-gray-300"
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>

//       {/* Edit Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit Product
//             </h3>

//             <form onSubmit={handleUpdateProduct}>
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Product Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Price:</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Category:</label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">Select a category</option>
//                   <option value="bead">Bead</option>
//                   <option value="tarts">Tarts</option>
//                   <option value="cakes">Cakes</option>
//                   <option value="cookies">Cookies</option>
//                 </select>
//               </div>

//               <button
//                 type="submit"
//                 className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// ------------------------- تصميم الاول--------------------------------
// import React, { useState, useEffect } from "react";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit);
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//       } else {
//         console.error("Failed to delete the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while deleting the product:", error);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editedProduct),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setProducts(
//           products.map((product) =>
//             product._id === updatedProduct._id ? updatedProduct : product
//           )
//         );
//         setSelectedProduct(null);
//       } else {
//         console.error("Failed to update the product.");
//       }
//     } catch (error) {
//       console.error("An error occurred while updating the product:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   const uniqueCategories = [...new Set(products.map((product) => product.category))];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">Product List</h1>

//       {/* Search and Filter Bar */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />

//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/4"
//         >
//           <option value="">All Categories</option>
//           {uniqueCategories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Products Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded">
//           <thead>
//             <tr className="bg-pink-700 text-white">
//               <th className="py-3 px-4">Image</th>
//               <th className="py-3 px-4">ID</th>
//               <th className="py-3 px-4">Product Name</th>
//               <th className="py-3 px-4">Price</th>
//               <th className="py-3 px-4">Category</th>
//               <th className="py-3 px-4">Availability</th>
//               <th className="py-3 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((product) => (
//               <tr key={product._id} className="border-b hover:bg-gray-50 transition">
//                 <td className="py-6 px-8 text-center">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                 </td>
//                 <td className="py-3 px-4 text-center text-xs">{product._id}</td>
//                 <td className="py-3 px-4 text-center font-semibold">{product.name}</td>
//                 <td className="py-3 px-4 text-center">{product.price} EGP</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-sm">
//                       Available
//                     </span>
//                   ) : (
//                     <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-sm">
//                       Unavailable
//                     </span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <button
//                     onClick={() => handleEdit(product._id)}
//                     className="bg-blue-500 text-white py-1 px-3 rounded mr-2 hover:bg-blue-600 w-24"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-2 mb-2 w-24"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredProducts.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center py-6 text-gray-500">
//                   No matching products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Edit Modal */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             {/* Close Button */}
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               Edit Product
//             </h3>

//             {/* Edit Form */}
//             <form onSubmit={handleUpdateProduct}>
//               {/* Product Name */}
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Product Name:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               {/* Price */}
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Price:</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               {/* Category */}
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">Category:</label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">Select a category</option>
//                   <option value="bead">Bead</option>
//                   <option value="tarts">Tarts</option>
//                   <option value="cakes">Cakes</option>
//                   <option value="cookies">Cookies</option>
//                 </select>
//               </div>

//               {/* Save Button */}
//               <button
//                 type="submit"
//                 className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
//               >
//                 Save Changes
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;

// ----------------------------- نسخه باللغه العربيه -----------------------------
// import React, { useState, useEffect } from "react";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [editedProduct, setEditedProduct] = useState({});

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         setProducts(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleEdit = (id) => {
//     const productToEdit = products.find((product) => product._id === id);
//     setSelectedProduct(productToEdit);
//     setEditedProduct(productToEdit); // إضافة نسخة قابلة للتعديل
//   };

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${id}`, {
//         method: "DELETE",
//       });

//       if (response.ok) {
//         setProducts(products.filter((product) => product._id !== id));
//       } else {
//         console.error("فشل حذف المنتج.");
//       }
//     } catch (error) {
//       console.error("حدث خطأ أثناء حذف المنتج:", error);
//     }
//   };

//   const handleUpdateProduct = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/products/${editedProduct._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(editedProduct),
//       });

//       if (response.ok) {
//         const updatedProduct = await response.json();
//         setProducts(
//           products.map((product) =>
//             product._id === updatedProduct._id ? updatedProduct : product
//           )
//         );
//         setSelectedProduct(null); // إغلاق المودال
//       } else {
//         console.error("فشل تحديث المنتج.");
//       }
//     } catch (error) {
//       console.error("حدث خطأ أثناء تحديث المنتج:", error);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setEditedProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesSearch =
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       product._id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
//     return matchesSearch && matchesCategory;
//   });

//   const uniqueCategories = [...new Set(products.map((product) => product.category))];

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6 text-pink-700">قائمة المنتجات</h1>

//       {/* شريط البحث والتصفية */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="ابحث بالاسم أو رقم المعرف..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/2"
//         />

//         <select
//           value={categoryFilter}
//           onChange={(e) => setCategoryFilter(e.target.value)}
//           className="border p-2 rounded w-full md:w-1/4"
//         >
//           <option value="">كل التصنيفات</option>
//           {uniqueCategories.map((cat) => (
//             <option key={cat} value={cat}>
//               {cat}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* جدول المنتجات */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white shadow-md rounded">
//           <thead>
//             <tr className="bg-pink-700 text-white">
//               <th className="py-3 px-4">الصورة</th>
//               <th className="py-3 px-4">رقم المعرف</th>
//               <th className="py-3 px-4">اسم المنتج</th>
//               <th className="py-3 px-4">السعر</th>
//               <th className="py-3 px-4">التصنيف</th>
//               <th className="py-3 px-4">التوفر</th>
//               <th className="py-3 px-4">الإجراءات</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProducts.map((product) => (
//               <tr key={product._id} className="border-b hover:bg-gray-50 transition">
//                 <td className="py-6 px-8 text-center">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-20 h-20 object-cover rounded"
//                   />
//                 </td>
//                 <td className="py-3 px-4 text-center text-xs">{product._id}</td>
//                 <td className="py-3 px-4 text-center font-semibold">{product.name}</td>
//                 <td className="py-3 px-4 text-center">{product.price} جنيه</td>
//                 <td className="py-3 px-4 text-center">{product.category}</td>
//                 <td className="py-3 px-4 text-center">
//                   {product.availability ? (
//                     <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-sm">
//                       متوفر
//                     </span>
//                   ) : (
//                     <span className="bg-red-200 text-red-800 py-1 px-3 rounded-full text-sm">
//                       غير متوفر
//                     </span>
//                   )}
//                 </td>
//                 <td className="py-3 px-4 text-center">
//                   <button
//                     onClick={() => handleEdit(product._id)}
//                     className="bg-blue-500 text-white py-1 px-3 rounded mr-2 hover:bg-blue-600"
//                   >
//                     تعديل
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 mt-2 mb-2"
//                   >
//                     حذف
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {filteredProducts.length === 0 && (
//               <tr>
//                 <td colSpan="7" className="text-center py-6 text-gray-500">
//                   لا توجد منتجات مطابقة.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* مودال التعديل */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative animate-fadeIn">
//             {/* زر إغلاق */}
//             <button
//               onClick={() => setSelectedProduct(null)}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//             >
//               ✖️
//             </button>

//             <h3 className="text-2xl font-bold mb-6 text-pink-700 text-center">
//               تعديل المنتج
//             </h3>

//             {/* نموذج التعديل */}
//             <form onSubmit={handleUpdateProduct}>
//               {/* اسم المنتج */}
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">اسم المنتج:</label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={editedProduct.name || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               {/* السعر */}
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">السعر:</label>
//                 <input
//                   type="number"
//                   name="price"
//                   value={editedProduct.price || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 />
//               </div>

//               {/* التصنيف */}
//               <div className="mb-4">
//                 <label className="block mb-2 text-gray-700 font-semibold">التصنيف:</label>
//                 <select
//                   name="category"
//                   value={editedProduct.category || ""}
//                   onChange={handleChange}
//                   className="border p-2 rounded w-full focus:outline-pink-400"
//                 >
//                   <option value="">اختر تصنيفًا</option>
//                   <option value="bead">Bead</option>
//                   <option value="tarts">Tarts</option>
//                   <option value="cakes">Cakes</option>
//                   <option value="cookies">Cookies</option>
//                 </select>
//               </div>

//               {/* زر الحفظ */}
//               <button
//                 type="submit"
//                 className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
//               >
//                 حفظ التعديلات
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductList;
// ----------------------------- نسخه باللغه العربيه -----------------------------
