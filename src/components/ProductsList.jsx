import { useState, useEffect } from "react";
import axios from "axios";  // استيراد axios
import ProductCard from "./ProductCard";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [priceOrder, setPriceOrder] = useState("default");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://bakeryproject-1onw.onrender.com/api/products/all");

        const data = response.data;

        const filtered = category
          ? data.filter((product) => product.category === category)
          : data;

        setProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().startsWith(searchName.toLowerCase())
    )
    .sort((a, b) => {
      if (priceOrder === "asc") return a.price - b.price;
      if (priceOrder === "desc") return b.price - a.price;
      return 0;
    });

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <div className="border-4 border-gray-900 border-t-pink-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-xl">Error: {error}</p>
      </div>
    );

  return (
    <div className="pt-28 px-4 md:px-12 bg-gradient-to-b from-pink-50 to-white min-h-screen pb-20">
      {/* Filters Section */}
      <div className="mb-12 bg-white shadow-xl rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-gray-200">
        <input
          type="text"
          placeholder="Search by product name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-full md:w-1/2 px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-700 transition"
        />

        <select
          value={priceOrder}
          onChange={(e) => setPriceOrder(e.target.value)}
          className="w-full md:w-1/3 px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-700 transition"
        >
          <option value="default">Sort by price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-lg">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductList;
