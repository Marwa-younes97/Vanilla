// import React, { useState, useEffect } from 'react';
// import Toast from "./Toast"; // تأكد من مسار الملف

// const ReviewsList = () => {
//   const [reviews, setReviews] = useState([]);
//   const [filteredReviews, setFilteredReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState("success");

//   useEffect(() => {
//     const fetchProductsAndReviews = async () => {
//       try {
//         const response = await fetch('https://bakeryproject-1onw.onrender.com/api/products/all');
//         const data = await response.json();

//         const allReviews = data.flatMap(product =>
//           product.reviews.map(review => ({
//             id: review._id,
//             userId: review.user,
//             rating: review.rating,
//             comment: review.comment,
//             productName: product.name,
//             createdAt: review.createdAt,
//           }))
//         );

//         setReviews(allReviews);
//         setFilteredReviews(allReviews);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     };

//     fetchProductsAndReviews();
//   }, []);

//   const showToast = (message, type = "success") => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);
//     setTimeout(() => setToastVisible(false), 3000);
//   };

//   const handleDeleteReview = (id) => {
//     const updatedReviews = reviews.filter(review => review.id !== id);
//     setReviews(updatedReviews);

//     if (selectedRating > 0) {
//       setFilteredReviews(updatedReviews.filter(review => review.rating === selectedRating));
//     } else {
//       setFilteredReviews(updatedReviews);
//     }

//     showToast("Review deleted successfully", "success");
//   };

//   const filterByRating = (rating) => {
//     setSelectedRating(rating);
//     if (rating === 0) {
//       setFilteredReviews(reviews);
//     } else {
//       setFilteredReviews(reviews.filter(review => review.rating === rating));
//     }
//   };

//   if (loading) {
//     return <p className="p-6">Loading reviews...</p>;
//   }

//   return (
//     <div className="p-6">
//       <Toast visible={toastVisible} message={toastMessage} type={toastType} />

//       <h2 className="text-2xl font-bold mb-6">Product Reviews List</h2>

//       <div className="mb-6 flex flex-wrap gap-3">
//         <button
//           onClick={() => filterByRating(0)}
//           className={`px-4 py-2 rounded ${selectedRating === 0 ? 'bg-pink-700 text-white' : 'bg-gray-200 text-pink-700'}`}
//         >
//           All
//         </button>
//         {[5, 4, 3, 2, 1].map((star) => (
//           <button
//             key={star}
//             onClick={() => filterByRating(star)}
//             className={`px-4 py-2 rounded ${selectedRating === star ? 'bg-pink-700 text-white' : 'bg-gray-200 text-pink-700'}`}
//           >
//             {star} Stars
//           </button>
//         ))}
//       </div>

//       {filteredReviews.length === 0 ? (
//         <p className="text-gray-500">No reviews matching this filter.</p>
//       ) : (
//         <div className="space-y-4">
//           {filteredReviews.map((review) => (
//             <div key={review.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
//               <div>
//                 <p className="font-semibold">{review.userId} on {review.productName}</p>
//                 <p className="text-yellow-500">
//                   {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                 </p>
//                 <p className="text-gray-600 mt-2">{review.comment}</p>
//                 <p className="text-gray-400 text-sm mt-1">{new Date(review.createdAt).toLocaleString()}</p>
//               </div>

//               <button
//                 onClick={() => handleDeleteReview(review.id)}
//                 className="text-red-500 hover:text-red-700 font-bold"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewsList;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Select from 'react-select';

// const ReviewsList = () => {
//   const [reviews, setReviews] = useState([]);
//   const [filteredReviews, setFilteredReviews] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [selectedRating, setSelectedRating] = useState(0);

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: state.isFocused ? '#f472b6' : '#ccc',
//       boxShadow: state.isFocused ? '0 0 0 1px #f472b6' : 'none',
//       '&:hover': {
//         borderColor: '#f472b6',
//       },
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       backgroundColor: state.isFocused ? '#fbcfe8' : '#fff',
//       color: '#000',
//     }),
//   };

//   useEffect(() => {
//     const fetchReviews = async () => {
//       try {
//         const response = await axios.get('https://bakeryproject-1onw.onrender.com/api/products/all');
//         const allReviews = response.data.flatMap(product =>
//           product.reviews.map(review => ({
//             id: review._id,
//             userId: review.user,
//             rating: review.rating,
//             comment: review.comment,
//             productName: product.name,
//             createdAt: review.createdAt,
//             productImage: product.image
//           }))
//         );
//         setReviews(allReviews);
//         setFilteredReviews(allReviews);
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReviews();
//   }, []);

//   useEffect(() => {
//     const filtered = reviews.filter(review => {
//       const matchesSearch =
//         review.userId.toLowerCase().includes(search.toLowerCase()) ||
//         review.comment.toLowerCase().includes(search.toLowerCase());
//       const matchesRating = selectedRating === 0 || review.rating === selectedRating;
//       return matchesSearch && matchesRating;
//     });
//     setFilteredReviews(filtered);
//   }, [search, selectedRating, reviews]);

//   const handleDeleteReview = async (id) => {
//     try {
//       await axios.delete(`https://bakeryproject-1onw.onrender.com/api/reviews/${id}`);
//       setFilteredReviews(filteredReviews.filter(review => review.id !== id));
//     } catch (error) {
//       console.error('Error deleting review:', error);
//     }
//   };

//   if (loading) return <div className="text-center py-8">Loading...</div>;

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Product Reviews</h1>

//       {/* Filters */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Search by user or comment"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//           className="border border-gray-300 p-2 rounded focus:outline-pink-400"
//         />
//         <Select
//           value={selectedRating ? { label: `${selectedRating} Stars`, value: selectedRating } : null}
//           onChange={option => setSelectedRating(option ? option.value : 0)}
//           options={[
//             { label: 'All Ratings', value: 0 },
//             { label: '1 Star', value: 1 },
//             { label: '2 Stars', value: 2 },
//             { label: '3 Stars', value: 3 },
//             { label: '4 Stars', value: 4 },
//             { label: '5 Stars', value: 5 },
//           ]}
//           styles={customStyles}
//           placeholder="Filter by Rating"
//         />
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="table min-w-full divide-y divide-gray-200">
//           <thead className="bg-pink-100 text-pink-800">
//             <tr>
//             <th className="px-4 py-2 text-left">Image</th>
//               <th className="py-3 px-4 text-left">Product</th>
//               <th className="py-3 px-4 text-left">Rating</th>
//               <th className="py-3 px-4 text-left">Comment</th>
//               <th className="py-3 px-4 text-left">Created At</th>
//               <th className="py-3 px-4 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white">
//             {filteredReviews.map(review => (
//               <tr key={review.id} className="border-b hover:bg-gray-50 transition">
//                 <td className="px-4 py-2">
//                   <img
//                     src={review.productImage}
//                     alt="Product"
//                     className="w-16 h-16 object-cover rounded"
//                   />
//                 </td>
//                 <td className="px-4 py-3">{review.productName}</td>
//                 <td className="px-4 py-3">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</td>
//                 <td className="px-4 py-3">{review.comment}</td>
//                 <td className="px-4 py-3">{new Date(review.createdAt).toLocaleString()}</td>
//                 <td className="px-4 py-3 text-center">
//                   <button
//                     onClick={() => handleDeleteReview(review.id)}
//                     className="text-red-500 hover:text-red-700 font-bold"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ReviewsList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaTrash } from "react-icons/fa";

import Header from './Header';

const ReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#f472b6' : '#ccc',
      boxShadow: state.isFocused ? '0 0 0 1px #f472b6' : 'none',
      '&:hover': {
        borderColor: '#f472b6',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#fbcfe8' : '#fff',
      color: '#000',
    }),
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('https://bakeryproject-1onw.onrender.com/api/products/all');
        const allReviews = res.data.flatMap(product =>
          product.reviews.map(review => ({
            id: review._id,
            userId: review.user,
            rating: review.rating,
            comment: review.comment,
            productName: product.name,
            productImage: product.image,
            createdAt: review.createdAt,
            productId: product._id
          }))
        );
        setReviews(allReviews);
        setFilteredReviews(allReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    const filtered = reviews.filter(review => {
      const matchesSearch =
        review.comment.toLowerCase().includes(search.toLowerCase());
      const matchesRating = selectedRating === 0 || review.rating === selectedRating;
      return matchesSearch && matchesRating;
    });
    setFilteredReviews(filtered);
  }, [search, selectedRating, reviews]);

  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`https://bakeryproject-1onw.onrender.com/api/reviews/${reviewId}`);
      const updated = filteredReviews.filter(r => r.id !== reviewId);
      setFilteredReviews(updated);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  // Group reviews by productId
  const groupedByProduct = Object.values(
    filteredReviews.reduce((acc, review) => {
      if (!acc[review.productId]) {
        acc[review.productId] = {
          productName: review.productName,
          productImage: review.productImage,
          reviews: [],
        };
      }
      acc[review.productId].reviews.push(review);
      return acc;
    }, {})
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-700">Product Reviews</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search comments"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-pink-400"
        />
        <Select
          value={
            selectedRating
              ? { label: `${selectedRating} Stars`, value: selectedRating }
              : null
          }
          onChange={(option) => setSelectedRating(option ? option.value : 0)}
          options={[
            { label: 'All Ratings', value: 0 },
            { label: '1 Star', value: 1 },
            { label: '2 Stars', value: 2 },
            { label: '3 Stars', value: 3 },
            { label: '4 Stars', value: 4 },
            { label: '5 Stars', value: 5 },
          ]}
          styles={customStyles}
          placeholder="Filter by Rating"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className="table min-w-full divide-y divide-gray-200">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Avg. Rating</th>
              <th className="py-3 px-4 text-left">Comments</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {groupedByProduct.map((productGroup, idx) => {
              const { productName, productImage, reviews } = productGroup;
              const avgRating =
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

              return (
                <tr key={idx} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={productImage}
                      alt="Product"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">{productName}</td>
                  <td className="px-4 py-3 text-yellow-500">
                    {'★'.repeat(Math.round(avgRating))}
                    {'☆'.repeat(5 - Math.round(avgRating))}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                      {reviews.map((review) => (
                        <div key={review.id} className="text-sm text-gray-700">
                          {review.comment}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    {new Date(reviews[0].createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex flex-col gap-1 items-center">
                      {reviews.map((review) => (
                        <button
                          key={review.id}
                          onClick={() => handleDeleteReview(review.id)}
                          className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                        >
                          <FaTrash /> Delete
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsList;

