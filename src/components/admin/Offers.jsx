import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Toast from "./Toast";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [newOffer, setNewOffer] = useState({
    title: "",
    product: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // إضافة حالة للصفحة الحالية وعدد العروض في الصفحة
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 10;

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://bakeryproject-1onw.onrender.com/api/products/all",
          {
            headers: getAuthHeaders(),
          }
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await fetch(
          "https://bakeryproject-1onw.onrender.com/api/products/offers",
          {
            headers: getAuthHeaders(),
          }
        );
        const data = await response.json();

        if (data && Array.isArray(data)) {
          const formattedOffers = data.map((item, index) => {
            const productImage = item.image || "default-image-url.jpg";
            const startDate = item.startDate ? item.startDate.substring(0, 10) : "Not specified";
            const endDate = item.endDate ? item.endDate.substring(0, 10) : "Not specified";

            return {
              id: index + 1,
              title: item.title || "Not specified",
              product: item.productName || "Not specified",
              discount: item.discountPercentage || 0,
              startDate: startDate,
              endDate: endDate,
              productImage: productImage,
            };
          });

          setOffers(formattedOffers);
          setCurrentPage(1); // ترجع للصفحة الأولى بعد التحميل
        }
      } catch (error) {
        console.error("Failed to fetch offers", error);
      }
    };

    fetchProducts();
    fetchOffers();
  }, []);

  // حساب عروض الصفحة الحالية
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

  const totalPages = Math.ceil(offers.length / offersPerPage);

  // باقي الدوال handleChange, handleAddClick, handleEditClick, handleSaveOffer, handleDeleteOffer كما هي بدون تغيير

  const handleChange = (e) => {
    setNewOffer({ ...newOffer, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setModalMode("add");
    setNewOffer({
      title: "",
      product: "",
      discount: "",
      startDate: "",
      endDate: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (offer) => {
    setModalMode("edit");
    setEditingOfferId(offer.id);
    const product = products.find((p) => p.name === offer.product);

    setNewOffer({
      title: offer.title,
      product: product?._id || "",
      discount: offer.discount,
      startDate: offer.startDate,
      endDate: offer.endDate,
    });
    setShowModal(true);
  };

  const handleSaveOffer = async () => {
    const selectedProduct = products.find(
      (p) => p._id === newOffer.product || p.name === newOffer.product
    );

    if (!selectedProduct) {
      showToast("Invalid product selection", "error");
      return;
    }

    const offerPayload = {
      title: newOffer.title,
      discountPercentage: parseFloat(newOffer.discount),
      startDate: newOffer.startDate,
      endDate: newOffer.endDate,
    };

    const endpoint =
      modalMode === "add"
        ? `https://bakeryproject-1onw.onrender.com/api/products/${selectedProduct._id}/offer/add`
        : `https://bakeryproject-1onw.onrender.com/api/products/${selectedProduct._id}/offer/edit`;

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(offerPayload),
      });

      if (!response.ok) throw new Error("Failed to save offer");

      const data = await response.json();

      const updatedOffer = {
        id: Date.now(),
        title: data.product.offer.title,
        product: data.product.name,
        discount: data.product.offer.discountPercentage,
        startDate: data.product.offer.startDate.substring(0, 10),
        endDate: data.product.offer.endDate.substring(0, 10),
      };

      if (modalMode === "add") {
        setOffers([...offers, updatedOffer]);
        showToast("Offer added successfully!");
      } else {
        setOffers(
          offers.map((offer) =>
            offer.id === editingOfferId ? updatedOffer : offer
          )
        );
        showToast("Offer updated successfully!");
      }

      setShowModal(false);
      setNewOffer({
        title: "",
        product: "",
        discount: "",
        startDate: "",
        endDate: "",
      });
      setModalMode("add");
      setEditingOfferId(null);
    } catch (error) {
      console.error(error);
      showToast("Failed to save offer", "error");
    }
  };

  const handleDeleteOffer = async (id) => {
    const offerToDelete = offers.find((o) => o.id === id);
    const selectedProduct = products.find(
      (p) => p.name === offerToDelete.product
    );

    if (!selectedProduct) {
      showToast("Product not found for deletion", "error");
      return;
    }

    try {
      const response = await fetch(
        `https://bakeryproject-1onw.onrender.com/api/products/${selectedProduct._id}/offer/delete`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) throw new Error("Failed to delete offer");

      setOffers(offers.filter((offer) => offer.id !== id));
      showToast("Offer deleted successfully!", "error");
    } catch (error) {
      console.error(error);
      showToast("Failed to delete offer", "error");
    }
  };

  return (
    <div className="p-6">
      <Toast visible={toastVisible} message={toastMessage} type={toastType} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold mb-6 text-pink-700">Offers</h2>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded"
        >
          Add New Offer
        </button>
      </div>

      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-pink-100 text-pink-800">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Discount (%)</th>
              <th className="py-2 px-4">Start Date</th>
              <th className="py-2 px-4">End Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOffers.length > 0 ? (
              currentOffers.map((offer) => (
                <tr key={offer.id} className="text-center border-t">
                  <td className="py-2 px-4">{offer.title}</td>
                  <td className="py-2 px-4">{offer.product}</td>
                  <td className="py-2 px-4">{offer.discount}%</td>
                  <td className="py-2 px-4">{offer.startDate}</td>
                  <td className="py-2 px-4">{offer.endDate}</td>
                  <td className="py-2 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEditClick(offer)}
                        className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No offers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {offers.length > offersPerPage && (
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

{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 mt-9">
    <div className="bg-white p-8 rounded shadow-md w-[400px]">
      <h3 className="text-xl font-bold mb-4">
        {modalMode === "add" ? "Add New Offer" : "Edit Offer"}
      </h3>
      <div className="space-y-4">
        <input
          type="text"
          name="title"
          value={newOffer.title}
          onChange={handleChange}
          placeholder="Offer Title"
          className="w-full border rounded p-2"
        />

        <select
          name="product"
          value={newOffer.product}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="discount"
          value={newOffer.discount}
          onChange={handleChange}
          placeholder="Discount Percentage"
          className="w-full border rounded p-2"
        />

        {/* جملة توضيحية لتواريخ البداية والنهاية */}
        <p className="text-sm text-gray-600">
        Offer start and end dates
        </p>

        <input
          type="date"
          name="startDate"
          value={newOffer.startDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="date"
          name="endDate"
          value={newOffer.endDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="mb-4 flex justify-between gap-4 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="w-1/2 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveOffer}
          className="w-1/2 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          {modalMode === "add" ? "Add" : "Update"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Offers;

