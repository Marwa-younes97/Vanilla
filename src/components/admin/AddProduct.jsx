import React, { useState, useEffect } from "react";
import Select from "react-select";
import Toast from "./Toast"; // استيراد مكون التوست

const AddProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [availability, setAvailability] = useState(true);
  const [categories, setCategories] = useState([]);

  // حالة التوست
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
        const data = await response.json();
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast("Error fetching categories.", "error");
      }
    };

    fetchCategories();
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      name,
      description,
      price,
      category,
      image,
      availability,
    };

    const token = localStorage.getItem("token");

    if (!token) {
      showToast("You must be logged in to add a product.", "error");
      return;
    }

    try {
      const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        showToast("Product added successfully!");
        // إعادة تعيين الحقول بعد الإضافة
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setImage("");
        setAvailability(true);
      } else {
        showToast("An error occurred while adding the product.", "error");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      showToast("An error occurred while adding the product.", "error");
    }
  };

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

  const availabilityOptions = [
    { label: "Available", value: true },
    { label: "Not Available", value: false },
  ];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">Product Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium">Price (EGP)</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">Category</label>
          <Select
            id="category"
            value={category ? { label: category, value: category } : null}
            onChange={(selectedOption) => setCategory(selectedOption ? selectedOption.label : "")}
            options={categories.map(cat => ({ label: cat, value: cat }))}
            styles={customStyles}
            placeholder="Select a category" // إضافة الـ placeholder
            isClearable={false} // إيقاف إظهار علامة "X"
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
          <Select
            id="availability"
            value={availability ? { label: "Available", value: true } : { label: "Not Available", value: false }}
            onChange={(selectedOption) => setAvailability(selectedOption.value)}
            options={availabilityOptions}
            styles={customStyles}
            placeholder="Select availability" // إضافة الـ placeholder
            isClearable={false} // إيقاف إظهار علامة "X"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium">Product Image URL</label>
          <input
            type="text"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <button type="submit" className="bg-pink-700 text-white py-2 px-6 rounded hover:bg-pink-800">
            Add Product
          </button>
        </div>
      </form>

      {/* Toast Component */}
      <Toast message={toastMessage} visible={toastVisible} type={toastType} />
    </div>
  );
};

export default AddProduct;

// --------------------تصميم ثاني--------------------
// import React, { useState, useEffect } from "react";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [categories, setCategories] = useState([]); // To store the categories

//   useEffect(() => {
//     // Fetch categories from products
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         const uniqueCategories = [...new Set(data.map(product => product.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newProduct = {
//       name,
//       description,
//       price,
//       category,
//       image,
//       availability,
//     };

//     try {
//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         alert("Product added successfully!");
//       } else {
//         alert("An error occurred while adding the product.");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("An error occurred while adding the product.");
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Product Name */}
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium text-gray-600">Product Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//             placeholder="Enter product name"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-600">Product Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//             placeholder="Enter product description"
//             required
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <label htmlFor="price" className="block text-sm font-medium text-gray-600">Price (EGP)</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//             placeholder="Enter product price"
//             required
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium text-gray-600">Category</label>
//           <select
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Product Image */}
//         <div>
//           <label htmlFor="image" className="block text-sm font-medium text-gray-600">Product Image URL</label>
//           <input
//             type="text"
//             id="image"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//             placeholder="Enter product image URL"
//             required
//           />
//         </div>

//         {/* Availability */}
//         <div>
//           <label htmlFor="availability" className="block text-sm font-medium text-gray-600">Availability</label>
//           <select
//             id="availability"
//             value={availability}
//             onChange={(e) => setAvailability(e.target.value === "true")}
//             className="mt-2 block w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
//           >
//             <option value="true">Available</option>
//             <option value="false">Not Available</option>
//           </select>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button type="submit" className="w-full py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700 transition duration-300">
//             Add Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
// --------------------------------------------------
// import React, { useState, useEffect } from "react";
// import Toast from "./Toast"; // استيراد مكون التوست

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [categories, setCategories] = useState([]);

//   // حالة التوست
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         const uniqueCategories = [...new Set(data.map(product => product.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         showToast("Error fetching categories.", "error");
//       }
//     };

//     fetchCategories();
//   }, []);

//   const showToast = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newProduct = {
//       name,
//       description,
//       price,
//       category,
//       image,
//       availability,
//     };

//     const token = localStorage.getItem("token");

//     if (!token) {
//       showToast("You must be logged in to add a product.", "error");
//       return;
//     }

//     try {
//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         showToast("Product added successfully!");
//         // إعادة تعيين الحقول بعد الإضافة
//         setName("");
//         setDescription("");
//         setPrice("");
//         setCategory("");
//         setImage("");
//         setAvailability(true);
//       } else {
//         showToast("An error occurred while adding the product.", "error");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       showToast("An error occurred while adding the product.", "error");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium">Product Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium">Price (EGP)</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium">Category</label>
//           <select
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="image" className="block text-sm font-medium">Product Image URL</label>
//           <input
//             type="text"
//             id="image"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
//           <select
//             id="availability"
//             value={availability}
//             onChange={(e) => setAvailability(e.target.value === "true")}
//             className="mt-1 block w-full border p-2 rounded"
//           >
//             <option value="true">Available</option>
//             <option value="false">Not Available</option>
//           </select>
//         </div>

//         <div>
//           <button type="submit" className="bg-pink-700 text-white py-2 px-6 rounded hover:bg-pink-800">
//             Add Product
//           </button>
//         </div>
//       </form>

//       {/* Toast Component */}
//       <Toast message={toastMessage} visible={toastVisible} type={toastType} />
//     </div>
//   );
// };

// export default AddProduct;

// -------------------------------------------------
// import React, { useState, useEffect } from "react";
// import CreatableSelect from "react-select/creatable";
// import Toast from "./Toast"; // استيراد مكون التوست

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [categories, setCategories] = useState([]);

//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         const uniqueCategories = [...new Set(data.map(product => product.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//         showToast("Error fetching categories.", "error");
//       }
//     };

//     fetchCategories();
//   }, []);

//   const showToast = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 3000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!category.trim()) {
//       showToast("Please select or enter a category.", "error");
//       return;
//     }

//     const newProduct = {
//       name,
//       description,
//       price,
//       category,
//       image,
//       availability,
//     };

//     const token = localStorage.getItem("token");

//     if (!token) {
//       showToast("You must be logged in to add a product.", "error");
//       return;
//     }

//     try {
//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         showToast("Product added successfully!");
//         setName("");
//         setDescription("");
//         setPrice("");
//         setCategory("");
//         setImage("");
//         setAvailability(true);
//       } else {
//         showToast("An error occurred while adding the product.", "error");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       showToast("An error occurred while adding the product.", "error");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium">Product Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium">Price (EGP)</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium">Category</label>
//           <CreatableSelect
//             isClearable
//             onChange={(selected) => setCategory(selected ? selected.value : "")}
//             options={categories.map(cat => ({ value: cat, label: cat }))}
//             placeholder="Select or type a category"
//             className="react-select-container"
//             classNamePrefix="react-select"
//           />
//         </div>

//         <div>
//           <label htmlFor="image" className="block text-sm font-medium">Product Image URL</label>
//           <input
//             type="text"
//             id="image"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
//           <select
//             id="availability"
//             value={availability}
//             onChange={(e) => setAvailability(e.target.value === "true")}
//             className="mt-1 block w-full border p-2 rounded"
//           >
//             <option value="true">Available</option>
//             <option value="false">Not Available</option>
//           </select>
//         </div>

//         <div>
//           <button type="submit" className="bg-pink-700 text-white py-2 px-6 rounded hover:bg-pink-800">
//             Add Product
//           </button>
//         </div>
//       </form>

//       {/* Toast Component */}
//       <Toast message={toastMessage} visible={toastVisible} type={toastType} />
//     </div>
//   );
// };

// export default AddProduct;



// -------------------كود كامل ------------------
// import React, { useState, useEffect } from "react";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         const uniqueCategories = [...new Set(data.map(product => product.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newProduct = {
//       name,
//       description,
//       price,
//       category,
//       image,
//       availability,
//     };

//     const token = localStorage.getItem("token");

//     if (!token) {
//       alert("You must be logged in to add a product.");
//       return;
//     }

//     try {
//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         alert("Product added successfully!");
//       } else {
//         alert("An error occurred while adding the product.");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("An error occurred while adding the product.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="description" className="block text-sm font-medium">Product Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="price" className="block text-sm font-medium">Price (EGP)</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="category" className="block text-sm font-medium">Category</label>
//           <select
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label htmlFor="image" className="block text-sm font-medium">Product Image URL</label>
//           <input
//             type="text"
//             id="image"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
//           <select
//             id="availability"
//             value={availability}
//             onChange={(e) => setAvailability(e.target.value === "true")}
//             className="mt-1 block w-full border p-2 rounded"
//           >
//             <option value="true">Available</option>
//             <option value="false">Not Available</option>
//           </select>
//         </div>

//         <div>
//           <button type="submit" className="bg-pink-700 text-white py-2 px-6 rounded hover:bg-pink-800">
//             Add Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;
// -------------------كود كامل ------------------

// --------------------- تصميم الاولى ---------------------
// import React, { useState, useEffect } from "react";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [categories, setCategories] = useState([]); // To store the categories

//   useEffect(() => {
//     // Fetch categories from products
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         const uniqueCategories = [...new Set(data.map(product => product.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newProduct = {
//       name,
//       description,
//       price,
//       category,
//       image,
//       availability,
//     };

//     try {
//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         alert("Product added successfully!");
//       } else {
//         alert("An error occurred while adding the product.");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("An error occurred while adding the product.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Product Name */}
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium">Product Name</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium">Product Description</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* Price */}
//         <div>
//           <label htmlFor="price" className="block text-sm font-medium">Price (EGP)</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* Category */}
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium">Category</label>
//           <select
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           >
//             <option value="">Select a category</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Product Image */}
//         <div>
//           <label htmlFor="image" className="block text-sm font-medium">Product Image URL</label>
//           <input
//             type="text"
//             id="image"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* Availability */}
//         <div>
//           <label htmlFor="availability" className="block text-sm font-medium">Availability</label>
//           <select
//             id="availability"
//             value={availability}
//             onChange={(e) => setAvailability(e.target.value === "true")}
//             className="mt-1 block w-full border p-2 rounded"
//           >
//             <option value="true">Available</option>
//             <option value="false">Not Available</option>
//           </select>
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button type="submit" className="bg-pink-700 text-white py-2 px-6 rounded hover:bg-pink-800">
//             Add Product
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

// ------------------------------نسخه باللغه العربيه------------------------------
// import React, { useState, useEffect } from "react";

// const AddProduct = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [price, setPrice] = useState("");
//   const [category, setCategory] = useState("");
//   const [image, setImage] = useState("");
//   const [availability, setAvailability] = useState(true);
//   const [categories, setCategories] = useState([]); // لتخزين التصنيفات

//   useEffect(() => {
//     // جلب التصنيفات من المنتجات
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await response.json();
//         const uniqueCategories = [...new Set(data.map(product => product.category))];
//         setCategories(uniqueCategories);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const newProduct = {
//       name,
//       description,
//       price,
//       category,
//       image,
//       availability,
//     };

//     try {
//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newProduct),
//       });

//       if (response.ok) {
//         alert("تم إضافة المنتج بنجاح!");
//       } else {
//         alert("حدث خطأ أثناء إضافة المنتج.");
//       }
//     } catch (error) {
//       console.error("Error adding product:", error);
//       alert("حدث خطأ أثناء إضافة المنتج.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">إضافة منتج جديد</h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* اسم المنتج */}
//         <div>
//           <label htmlFor="name" className="block text-sm font-medium">اسم المنتج</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* الوصف */}
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium">وصف المنتج</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* السعر */}
//         <div>
//           <label htmlFor="price" className="block text-sm font-medium">السعر (بالجنيه)</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* التصنيف */}
//         <div>
//           <label htmlFor="category" className="block text-sm font-medium">التصنيف</label>
//           <select
//             id="category"
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           >
//             <option value="">اختر تصنيفًا</option>
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* صورة المنتج */}
//         <div>
//           <label htmlFor="image" className="block text-sm font-medium">رابط صورة المنتج</label>
//           <input
//             type="text"
//             id="image"
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             className="mt-1 block w-full border p-2 rounded"
//             required
//           />
//         </div>

//         {/* التوفر */}
//         <div>
//           <label htmlFor="availability" className="block text-sm font-medium">التوفر</label>
//           <select
//             id="availability"
//             value={availability}
//             onChange={(e) => setAvailability(e.target.value === "true")}
//             className="mt-1 block w-full border p-2 rounded"
//           >
//             <option value="true">متوفر</option>
//             <option value="false">غير متوفر</option>
//           </select>
//         </div>

//         {/* زر الإرسال */}
//         <div>
//           <button type="submit" className="bg-pink-700 text-white py-2 px-6 rounded hover:bg-pink-800">
//             إضافة المنتج
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddProduct;

// ------------------------------نسخه باللغه العربيه------------------------------