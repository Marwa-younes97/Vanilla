import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = [
  {
    label: 'NEW!',
    title: 'Cakes',
    description: 'Delicious layered cakes for every celebration.',
    image: 'https://images.unsplash.com/photo-1618426703623-c1b335803e07?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/cakes',
  },
  {
    title: 'Bread',
    description: 'Freshly baked bread with crispy crust.',
    image: 'https://th.bing.com/th/id/OIP.9W4BTQUxQA7EKIm9jEdLHgHaE8?rs=1&pid=ImgDetMain',
    link: '/bread',
  },
  {
    title: 'Tarts',
    description: 'Tarts with rich filling and a buttery base.',
    image: 'https://images.unsplash.com/photo-1614174486496-344ef3e9d870?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/tarts',
  },

  {
    title: 'Cookies',
    description: 'Crunchy on the outside, soft on the inside — perfect with tea or coffee',
    image: 'https://th.bing.com/th/id/OIP.upZhZb_plrGM-ojKhOocRQHaLH?cb=iwc2&w=700&h=1050&rs=1&pid=ImgDetMain',
    link: '/cookies',
  },
  {
    label: 'CLASSIC',
    title: 'Pastry',
    description: 'Flaky, golden layers filled with sweet or savory goodness',
    image: 'https://th.bing.com/th/id/OIP.XQxDyBJtPEVhNjTQYMEIFgHaFo?cb=iwc2&w=1346&h=1024&rs=1&pid=ImgDetMain',
    link: '/pastry',
  },
];

const Loader = () => (
  <div className="flex justify-center items-center py-10">
    <div className="w-16 h-16 border-4 border-t-4 border-pink-700 rounded-full animate-spin"></div>
  </div>
);

const ProductCategories = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setProducts(categories);
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="px-6 py-12 bg-white mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold text-pink-700 mb-4">
          Welcome to Sweet Moments
        </h2>
        <p className="text-gray-600 text-lg font-bold">
          Discover a world of delicious baked goods — from cakes to tarts, each treat is crafted with love and elegance. Explore our hand-picked categories below!
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-12">
          {products.map((item, index) => (
            <Link to={item.link || "#"} key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <img src={item.image} alt={item.title} className="w-full h-56 object-cover rounded-t-xl" />
                {item.label && (
                  <div className="absolute top-3 left-3 text-pink-700 text-sm font-semibold bg-white bg-opacity-70 px-2 py-0.5 rounded">
                    {item.label}
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2 text-pink-700">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* قسم المناسبات */}
      <div className="mt-24 text-center max-w-4xl mx-auto">
        <div className="inline-block bg-pink-100 text-pink-800 font-bold text-lg px-6 py-3 rounded-full shadow-md mb-6">
          We're with you for every occasion 🎀
        </div>

        <p className="text-gray-600 text-lg font-medium mb-12">
          Whether you're celebrating a birthday or saying thank you to a colleague, you'll find goodies for life's little, big and everything-in-between moments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-[700px]">
            <Link to="/birthday">
              <img
                src="https://i.pinimg.com/474x/83/4b/8c/834b8c64fd3af9a91e4c794c4b0f39cc.jpg"
                alt="Birthday Celebration"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-white/80 p-4">
                <h4 className="text-xl font-bold text-pink-700 mb-2">Birthday Specials</h4>
                <p className="text-sm text-gray-700">
                  Celebrate in style with custom birthday cakes, party desserts, and more to make the day extra sweet!
                </p>
              </div>
            </Link>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-lg group h-[700px]">
            <Link to="/wedding">
              <img
                src="https://pic.cakesdecor.com/m/xjv2zevx3rn86k36fokx.jpg"
                alt="Weddings & Celebrations"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full bg-white/80 p-4">
                <h4 className="text-xl font-bold text-pink-700 mb-2">Wedding Treats</h4>
                <p className="text-sm text-gray-700">
                  From elegant wedding cakes to delightful favors, make your big day unforgettable with our sweet creations.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategories;
