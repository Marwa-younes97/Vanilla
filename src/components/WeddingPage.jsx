// import React, { useState } from 'react';
// import Slider from 'react-slick';
// import { MessageCircle, ImagePlus } from 'lucide-react';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import axios from 'axios';

// const images = [
//   'https://th.bing.com/th/id/OIP.G8zk4Rrkz8eDS9JpMW-ZBQAAAA?w=400&h=486&rs=1&pid=ImgDetMain',
//   'https://theglossychic.com/wp-content/uploads/2020/04/img_6655.jpg',
//   'https://images.squarespace-cdn.com/content/v1/52a4f61de4b0159222b37717/1402880909174-XJIEPSDI6ZWPSELQR9FR/ke17ZwdGBToddI8pDm48kHFnmntegnVXpN4y4ldn3ixZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxco7Gi2cI2YfBk8ZWdc_m6Xcr86dXh8TsiE3NyioNRZj9sD37Ved1vsRvl2h0UxBw/IMG_1053.jpg',
//   'https://th.bing.com/th/id/OIP.hm7t6lJkzOywBmm54RzhBAHaLH?rs=1&pid=ImgDetMain',
//   'https://th.bing.com/th/id/OIP.w5EnLz2Y1dLVwOI5T4sHcgHaLG?w=614&h=920&rs=1&pid=ImgDetMain',
//   'https://th.bing.com/th/id/OIP.BWvCEAY9pyM7VPpnSck_gQHaLG?w=683&h=1024&rs=1&pid=ImgDetMain',
// ];

// const WeddingPage = () => {
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [description, setDescription] = useState('');
//   const [designImage, setDesignImage] = useState('');
//   const [pickupDate, setPickupDate] = useState('');

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 200,
//     slidesToShow: 2,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     cssEase: 'ease-in-out',
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const token = localStorage.getItem('authToken');
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     };
    

//     const deliveryDateISO = new Date(pickupDate).toISOString();

//     const data = {
//       description,
//       designImage,
//       deliveryDate: deliveryDateISO,
//     };

//     try {
//       await axios.post('https://bakeryproject-1onw.onrender.com/api/custom-orders', data, config);
//       alert('Order submitted successfully!');
//       setDescription('');
//       setDesignImage('');
//       setPickupDate('');
//       setSelectedImage(null);
//     } catch (error) {
//       console.error('Error submitting order:', error.response || error);
//       alert('Failed to submit the order.');
//     }
//   };

//   return (
//     <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 min-h-screen px-4 sm:px-10 py-10 mt-24">
//       <div className="text-center mb-14">
//         <h2 className="text-5xl font-extrabold text-pink-700">Wedding Treats</h2>
//         <p className="text-gray-600 text-lg mt-3 max-w-xl mx-auto">
//           Discover the perfect cake or treat to sweeten your wedding celebration.
//         </p>
//       </div>

//       <div className="mb-20 px-2 sm:px-8">
//         <div className="bg-white rounded-3xl border border-pink-200 shadow-lg p-4 sm:p-6">
//           <Slider {...settings}>
//             {images.map((img, idx) => (
//               <div key={idx} className="px-3">
//                 <div className="h-72 sm:h-80 md:h-[26rem] rounded-2xl overflow-hidden border border-pink-300 bg-pink-100 shadow-xl flex items-center justify-center transition duration-300 hover:scale-[1.03] hover:shadow-pink-400/50">
//                   <img
//                     src={img}
//                     alt={`Wedding ${idx}`}
//                     className="max-h-full max-w-full object-contain cursor-pointer"
//                     onClick={() => {
//                       setSelectedImage(img);
//                       setDesignImage(img);
//                     }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>

//       {selectedImage && (
//         <div className="mb-20 text-center">
//           <h3 className="text-2xl font-bold text-pink-700 mb-4">Selected Cake</h3>
//           <img
//             src={selectedImage}
//             alt="Selected"
//             className="w-full max-w-4xl mx-auto h-96 object-contain rounded-2xl shadow-xl"
//           />
//         </div>
//       )}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-gradient-to-br from-pink-700 to-white bg-opacity-30 backdrop-blur-lg max-w-3xl mx-auto p-10 rounded-3xl shadow-xl border border-pink-100"
//       >
//         <div className="mb-6">
//           <label htmlFor="message" className="flex items-center gap-2 text-gray-800 font-semibold">
//             <MessageCircle size={20} /> Description
//           </label>
//           <textarea
//             id="message"
//             rows="4"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white bg-opacity-70"
//             required
//           ></textarea>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="pickupDate" className="flex items-center gap-2 text-gray-800 font-semibold">
//             📅 Delivery Date
//           </label>
//           <input
//             type="date"
//             id="pickupDate"
//             value={pickupDate}
//             onChange={(e) => setPickupDate(e.target.value)}
//             className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white bg-opacity-70"
//             required
//           />
//         </div>

//         <div className="mb-6">
//           <label htmlFor="designImage" className="flex items-center gap-2 text-gray-800 font-semibold">
//             <ImagePlus size={20} /> Design Image URL
//           </label>
//           <input
//             type="text"
//             id="designImage"
//             value={designImage}
//             onChange={(e) => setDesignImage(e.target.value)}
//             placeholder="Paste image URL or select from above"
//             className="w-full mt-2 p-3 border rounded-lg bg-white bg-opacity-70"
//             required
//           />
//         </div>

//         <div className="flex justify-center items-center">
//           <button className="w-[300px] text-center text-pink-700 bg-white hover:bg-pink-700 hover:text-white py-3 px-6 rounded-lg font-bold transition-all duration-300">
//           Confirm Order          </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default WeddingPage;

import React, { useState } from 'react';
import Slider from 'react-slick';
import { MessageCircle, ImagePlus } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axios from 'axios';

const images = [
  'https://th.bing.com/th/id/OIP.G8zk4Rrkz8eDS9JpMW-ZBQAAAA?w=400&h=486&rs=1&pid=ImgDetMain',
  'https://theglossychic.com/wp-content/uploads/2020/04/img_6655.jpg',
  'https://images.squarespace-cdn.com/content/v1/52a4f61de4b0159222b37717/1402880909174-XJIEPSDI6ZWPSELQR9FR/ke17ZwdGBToddI8pDm48kHFnmntegnVXpN4y4ldn3ixZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpxco7Gi2cI2YfBk8ZWdc_m6Xcr86dXh8TsiE3NyioNRZj9sD37Ved1vsRvl2h0UxBw/IMG_1053.jpg',
  'https://th.bing.com/th/id/OIP.hm7t6lJkzOywBmm54RzhBAHaLH?rs=1&pid=ImgDetMain',
  'https://th.bing.com/th/id/OIP.w5EnLz2Y1dLVwOI5T4sHcgHaLG?w=614&h=920&rs=1&pid=ImgDetMain',
  'https://th.bing.com/th/id/OIP.BWvCEAY9pyM7VPpnSck_gQHaLG?w=683&h=1024&rs=1&pid=ImgDetMain',
];

const WeddingPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [designImageFile, setDesignImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // 👈 جديد

  const settings = {
    dots: true,
    infinite: true,
    speed: 200,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'ease-in-out',
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const deliveryDateISO = new Date(pickupDate).toISOString();

    const formData = new FormData();
    formData.append('description', description);
    formData.append('deliveryDate', deliveryDateISO);
    formData.append('designImage', designImageFile); // backend expects this name

    try {
      await axios.post('https://bakeryproject-1onw.onrender.com/api/custom-orders', formData, config);
      alert('Order submitted successfully!');
      setDescription('');
      setPickupDate('');
      setDesignImageFile(null);
      setSelectedImage(null);
      setPreviewImage(null); // 👈 تنظيف المعاينة
    } catch (error) {
      console.error('Error submitting order:', error.response || error);
      alert('Failed to submit the order.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 min-h-screen px-4 sm:px-10 py-10 mt-24">
      <div className="text-center mb-14">
        <h2 className="text-5xl font-extrabold text-pink-700">Wedding Treats</h2>
        <p className="text-gray-600 text-lg mt-3 max-w-xl mx-auto">
          Discover the perfect cake or treat to sweeten your wedding celebration.
        </p>
      </div>

      <div className="mb-20 px-2 sm:px-8">
        <div className="bg-white rounded-3xl border border-pink-200 shadow-lg p-4 sm:p-6">
          <Slider {...settings}>
            {images.map((img, idx) => (
              <div key={idx} className="px-3">
                <div className="h-72 sm:h-80 md:h-[26rem] rounded-2xl overflow-hidden border border-pink-300 bg-pink-100 shadow-xl flex items-center justify-center transition duration-300 hover:scale-[1.03] hover:shadow-pink-400/50">
                  <img
                    src={img}
                    alt={`Wedding ${idx}`}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => {
                      setSelectedImage(img);
                    }}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>

      {selectedImage && (
        <div className="mb-20 text-center">
          <h3 className="text-2xl font-bold text-pink-700 mb-4">Selected Cake</h3>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-full max-w-4xl mx-auto h-96 object-contain rounded-2xl shadow-xl"
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-pink-700 to-white bg-opacity-30 backdrop-blur-lg max-w-3xl mx-auto p-10 rounded-3xl shadow-xl border border-pink-100"
      >
        <div className="mb-6">
          <label htmlFor="message" className="flex items-center gap-2 text-gray-800 font-semibold">
            <MessageCircle size={20} /> Description
          </label>
          <textarea
            id="message"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white bg-opacity-70"
            required
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="pickupDate" className="flex items-center gap-2 text-gray-800 font-semibold">
            📅 Delivery Date
          </label>
          <input
            type="date"
            id="pickupDate"
            value={pickupDate}
            onChange={(e) => setPickupDate(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white bg-opacity-70"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="designImage" className="flex items-center gap-2 text-gray-800 font-semibold">
            <ImagePlus size={20} /> Upload Design Image
          </label>
          <input
            type="file"
            id="designImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setDesignImageFile(file);
              if (file) {
                setPreviewImage(URL.createObjectURL(file));
              } else {
                setPreviewImage(null);
              }
            }}
            className="w-full mt-2 p-3 border rounded-lg bg-white bg-opacity-70"
            required
          />

          {previewImage && (
            <div className="mt-4 text-center">
              <p className="text-pink-700 font-semibold mb-2">Preview of your uploaded design:</p>
              <img
                src={previewImage}
                alt="Uploaded Design"
                className="mx-auto max-h-80 rounded-lg shadow-md border border-pink-300"
              />
            </div>
          )}
        </div>

        <div className="flex justify-center items-center">
          <button className="w-[300px] text-center text-pink-700 bg-white hover:bg-pink-700 hover:text-white py-3 px-6 rounded-lg font-bold transition-all duration-300">
            Confirm Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default WeddingPage;
