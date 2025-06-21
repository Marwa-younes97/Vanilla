// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaStar, FaRegStar } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useCart } from "../context/CartContext";

// function parseJwt(token) {
//   try {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(
//       atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
//     );
//     return JSON.parse(jsonPayload);
//   } catch {
//     return null;
//   }
// }

// const ProductDetails = () => {
//   const { productId } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();

//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [newRating, setNewRating] = useState(0);
//   const [newComment, setNewComment] = useState("");
//   const [userInfo, setUserInfo] = useState(null);

//   const token = localStorage.getItem("authToken");
//   const userData = parseJwt(token);
//   const userId = userData?.id;

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch("https://bakeryproject-1onw.onrender.com/api/products/all");
//         const data = await res.json();
//         const currentProduct = data.find(p => p._id === productId);
//         setProduct(currentProduct);

//         const related = data.filter(p => p.category === currentProduct.category && p._id !== productId);
//         setRelatedProducts(related.slice(0, 4));
//       } catch (err) {
//         console.error("Error fetching product:", err);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!userId || !token) return;
//       try {
//         const res = await fetch(`https://bakeryproject-1onw.onrender.com/api/users/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = await res.json();
//         setUserInfo(data);
//       } catch (err) {
//         console.error("Error fetching user info:", err);
//       }
//     };
//     fetchUser();
//   }, [userId, token]);

//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!newRating || !newComment) {
//       toast.error("Please enter a rating and comment");
//       return;
//     }

//     const userName = userInfo?.name || userInfo?.email || "Anonymous";

//     try {
//       const res = await fetch(
//         `https://bakeryproject-1onw.onrender.com/api/products/${productId}/reviews`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ rating: newRating, comment: newComment, name: userName }),
//         }
//       );

//       const result = await res.json();

//       if (!res.ok) throw new Error(result.message || "Failed to submit review");

//       toast.success("Review submitted!");
//       setProduct((prev) => ({
//         ...prev,
//         reviews: [...prev.reviews, result],
//       }));
//       setNewRating(0);
//       setNewComment("");
//     } catch (err) {
//       toast.error(err.message);
//     }
//   };

//   if (!product) return <div className="text-center p-6">Loading...</div>;

//   const averageRating =
//     product.reviews?.length > 0
//       ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
//       : 0;

//   return (
//     <div className="max-w-6xl mx-auto p-6 mt-28">
//       <button onClick={() => navigate(-1)} className="mb-4 text-pink-600 font-semibold hover:underline">
//         ← Back
//       </button>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-lg">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="w-full h-[350px] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
//         />

//         <div className="flex flex-col justify-between">
//           <div>
//             <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
//             <p className="text-gray-600 mb-3 text-base leading-relaxed">{product.description}</p>
//             <span
//               className={`inline-block px-4 py-1 mb-3 text-sm font-semibold rounded-full text-white ${
//                 product.availability ? "bg-green-500" : "bg-red-500"
//               }`}
//             >
//               {product.availability ? "Available" : "Not Available"}
//             </span>

//             <div className="flex items-center mb-3">
//               {Array.from({ length: 5 }).map((_, index) =>
//                 index < Math.round(averageRating) ? (
//                   <FaStar key={index} className="text-yellow-400 text-sm" />
//                 ) : (
//                   <FaRegStar key={index} className="text-gray-300 text-sm" />
//                 )
//               )}
//               <span className="ml-2 text-sm text-gray-500">({product.reviews?.length || 0})</span>
//             </div>

//             <p className="text-2xl text-pink-600 font-bold mb-5">{product.price} EGP</p>
//           </div>

//           <button
//             onClick={() => addToCart(product)}
//             className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105"
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>

//       {/* Reviews */}
//       {product.reviews?.length > 0 && (
//         <div className="mt-10">
//           <h3 className="text-2xl font-semibold mb-4">User Reviews</h3>
//           <ul className="space-y-6">
//             {product.reviews.map((review) => (
//               <li
//                 key={review._id}
//                 className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200"
//               >
//                 <div className="flex items-center mb-3">
//                   <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg mr-3 select-none">
//                     {(review.user?.name || review.name || "A").charAt(0).toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-pink-600 mb-1">
//                       {review.user?.name || review.name || "Anonymous"}
//                     </p>
//                     <div className="flex items-center mt-1">
//                       {Array.from({ length: 5 }).map((_, index) =>
//                         index < review.rating ? (
//                           <FaStar key={index} className="text-yellow-400" />
//                         ) : (
//                           <FaRegStar key={index} className="text-gray-300" />
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </div>
//                 <p className="text-gray-700 text-base leading-relaxed">{review.comment}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Add Review */}
//       <div className="mt-10">
//         <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
//         <form
//           onSubmit={handleReviewSubmit}
//           className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-md"
//         >
//           <div className="flex items-center">
//             {[1, 2, 3, 4, 5].map((star) =>
//               star <= newRating ? (
//                 <FaStar
//                   key={star}
//                   onClick={() => setNewRating(star)}
//                   className="text-yellow-400 cursor-pointer"
//                 />
//               ) : (
//                 <FaRegStar
//                   key={star}
//                   onClick={() => setNewRating(star)}
//                   className="text-gray-300 cursor-pointer"
//                 />
//               )
//             )}
//           </div>

//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             rows={3}
//             placeholder="Write your review..."
//             className="w-full p-3 rounded-lg border border-gray-300 focus:outline-pink-500"
//           />

//           <button
//             type="submit"
//             className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
//           >
//             Submit Review
//           </button>
//         </form>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length > 0 && (
//         <div className="mt-10">
//           <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {relatedProducts.map((relatedProduct) => (
//               <div
//                 key={relatedProduct._id}
//                 className="product-card bg-white shadow-md rounded-xl p-4 transition duration-300 transform hover:-translate-y-2 hover:shadow-[0_4px_20px_rgba(255,0,179,0.5)] cursor-pointer"
//                 onClick={() => navigate(`/product/${relatedProduct._id}`)}
//               >
//                 <img
//                   src={relatedProduct.image}
//                   alt={relatedProduct.name}
//                   className="w-full h-32 object-cover rounded-lg mb-4"
//                 />
//                 <h4 className="text-lg font-semibold mb-2">{relatedProduct.name}</h4>
//                 <p className="text-sm text-gray-500 mb-2">
//                   {relatedProduct.description.length > 100
//                     ? relatedProduct.description.substring(0, 100) + "..."
//                     : relatedProduct.description}
//                 </p>
//                 <p className="text-lg text-pink-700 mb-3">{relatedProduct.price} EGP</p>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     addToCart(relatedProduct);
//                   }}
//                   className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductDetails;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const token = localStorage.getItem("authToken");
  const userData = parseJwt(token);
  const userId = userData?.id;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          "https://bakeryproject-1onw.onrender.com/api/products/all"
        );
        const data = await res.json();
        const currentProduct = data.find((p) => p._id === productId);
        setProduct(currentProduct);

        const related = data.filter(
          (p) => p.category === currentProduct.category && p._id !== productId
        );
        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `https://bakeryproject-1onw.onrender.com/api/products/${productId}/reviews`
        );
        const reviews = await res.json();
        setProduct((prev) => ({ ...prev, reviews }));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [productId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !token) return;
      try {
        const res = await fetch(
          `https://bakeryproject-1onw.onrender.com/api/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUser();
  }, [userId, token]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newRating || !newComment) {
      toast.error("Please enter a rating and comment");
      return;
    }

    try {
      const res = await fetch(
        `https://bakeryproject-1onw.onrender.com/api/products/${productId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: newRating,
            comment: newComment,
          }),
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit review");

      toast.success("Review submitted!");
      setProduct((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), result],
      }));
      setNewRating(0);
      setNewComment("");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!product) return <div className="text-center p-6">Loading...</div>;

  const averageRating =
    product.reviews?.length > 0
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-28">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-pink-600 font-semibold hover:underline"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[350px] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-3 text-base leading-relaxed">
              {product.description}
            </p>
            <span
              className={`inline-block px-4 py-1 mb-3 text-sm font-semibold rounded-full text-white ${
                product.availability ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {product.availability ? "Available" : "Not Available"}
            </span>

            <div className="flex items-center mb-3">
              {Array.from({ length: 5 }).map((_, index) =>
                index < Math.round(averageRating) ? (
                  <FaStar key={index} className="text-yellow-400 text-sm" />
                ) : (
                  <FaRegStar key={index} className="text-gray-300 text-sm" />
                )
              )}
              <span className="ml-2 text-sm text-gray-500">
                ({product.reviews?.length || 0})
              </span>
            </div>

            <p className="text-2xl text-pink-600 font-bold mb-5">
              {product.price} EGP
            </p>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-2xl transition duration-300 transform hover:scale-105"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">User Reviews</h3>
          <ul className="space-y-6">
            {product.reviews.map((review) => (
              <li
                key={review._id}
                className="bg-gray-50 p-5 rounded-xl shadow-md border border-gray-200"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg mr-3 select-none">
                    {(review.user?.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-pink-600 mb-1">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <div className="flex items-center mt-1">
                      {Array.from({ length: 5 }).map((_, index) =>
                        index < review.rating ? (
                          <FaStar key={index} className="text-yellow-400" />
                        ) : (
                          <FaRegStar key={index} className="text-gray-300" />
                        )
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-base leading-relaxed">
                  {review.comment}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Review */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
        <form
          onSubmit={handleReviewSubmit}
          className="space-y-4 bg-gray-50 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) =>
              star <= newRating ? (
                <FaStar
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="text-yellow-400 cursor-pointer"
                />
              ) : (
                <FaRegStar
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="text-gray-300 cursor-pointer"
                />
              )
            )}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Write your review..."
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-pink-500"
          />

          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
          >
            Submit Review
          </button>
        </form>
      </div>

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
                <h4 className="text-lg font-semibold mb-2">
                  {relatedProduct.name}
                </h4>
                <p className="text-sm text-gray-500 mb-2">
                  {relatedProduct.description.length > 100
                    ? relatedProduct.description.substring(0, 100) + "..."
                    : relatedProduct.description}
                </p>
                <p className="text-lg text-pink-700 mb-3">
                  {relatedProduct.price} EGP
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(relatedProduct);
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
