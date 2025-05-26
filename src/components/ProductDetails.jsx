import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";


const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
        const data = await response.json();
        const selectedProduct = data.find((p) => p._id === productId);
        setProduct(selectedProduct);

        // Filter related products by category
        const related = data.filter((p) => p.category === selectedProduct.category && p._id !== productId);
        setRelatedProducts(related.slice(0, 4)); // Show only first 4 related products
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return <div className="text-center p-6">Loading...</div>;

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-28">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-pink-600 font-semibold hover:underline"
      >
        ← Back
      </button>

      {/* Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[350px] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-3 text-base leading-relaxed">{product.description}</p>

            {/* Availability Badge */}
            <span
              className={`inline-block px-4 py-1 mb-3 text-sm font-semibold rounded-full text-white ${product.availability ? "bg-green-500" : "bg-red-500"}`}
            >
              {product.availability ? "Available" : "Not Available"}
            </span>

            {/* Rating */}
            <div className="flex items-center mb-3">
              {Array.from({ length: 5 }).map((_, index) =>
                index < Math.round(averageRating) ? (
                  <FaStar key={index} className="text-yellow-400 text-sm" />
                ) : (
                  <FaRegStar key={index} className="text-gray-300 text-sm" />
                )
              )}
              <span className="ml-2 text-sm text-gray-500">({product.reviews?.length || 0})</span>
            </div>

            {/* Price */}
            <p className="text-2xl text-pink-600 font-bold mb-5">{product.price} EGP</p>
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => alert("Added to cart!")}
            className="  w-50%
            bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105
           "
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">User Reviews</h3>
          <ul className="space-y-4">
            {product.reviews.map((review) => (
              <li
                key={review._id}
                className="bg-gray-100 p-4 rounded-xl shadow-sm"
              >
                <p className="font-medium text-gray-800 mb-1">{review.comment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  {Array.from({ length: 5 }).map((_, index) =>
                    index < review.rating ? (
                      <FaStar key={index} className="text-yellow-400" />
                    ) : (
                      <FaRegStar key={index} className="text-gray-300" />
                    )
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="product-card bg-white shadow-md rounded-xl p-4 transition duration-300 transform hover:-translate-y-2 hover:shadow-[0_4px_20px_rgba(255,0,179,0.5)] cursor-pointer"
                onClick={() => navigate(`/product/${relatedProduct._id}`)}
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h4 className="text-lg font-semibold mb-2">{relatedProduct.name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  {relatedProduct.description.length > 100
                    ? relatedProduct.description.substring(0, 100) + "..."
                    : relatedProduct.description}
                </p>
                <p className="text-lg text-pink-700 mb-3">${relatedProduct.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigating when clicking the button
                    alert("Added to cart!");
                  }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
