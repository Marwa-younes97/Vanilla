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

  // ** states for pagination **
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

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
    setCurrentPage(1); // reset to first page on filter change
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

  // Pagination calculations
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;

  // احصل على مراجعات الصفحة الحالية
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  // Group current page reviews by productId
  const groupedByProduct = Object.values(
    currentReviews.reduce((acc, review) => {
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

  // عدد الصفحات الكلي
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

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
                          className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
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

      {/* Pagination controls */}
      {filteredReviews.length > reviewsPerPage && (
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
    </div>
  );
};

export default ReviewsList;
