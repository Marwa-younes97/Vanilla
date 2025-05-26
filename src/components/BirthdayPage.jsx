import React, { useState } from 'react';
import Slider from 'react-slick';
import { MessageCircle, ImagePlus } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const birthdayImages = [
  'https://i.etsystatic.com/25006701/r/il/9b95b1/2621742376/il_1588xN.2621742376_1k19.jpg',
  'https://bluebowlrecipes.com/wp-content/uploads/2022/06/perfect-fluffy-white-cake-4619-768x1152.jpg',
  'https://cakehouseonline.com/wp-content/uploads/2020/03/Ultimate-Funfetti-feature.jpg',
  'https://th.bing.com/th/id/OIP.yxJF_8lRMRM28zC0SdLSswAAAA?cb=iwc2&rs=1&pid=ImgDetMain',
  'https://www.deliciaecakes.com/static/9b62158c17917c27a305fa088ef7c9fc/3d-2158.jpg',
  'https://www.fabmood.com/inspiration/wp-content/uploads/2020/05/cake-designs-7.jpg',
  

];

const BirthdayPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [designImage, setDesignImage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا تضيف منطق إرسال البيانات أو ما تريد
    alert('Birthday order submitted!');
    setDescription('');
    setDesignImage('');
    setDeliveryDate('');
    setSelectedImage(null);
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-pink-100 min-h-screen px-4 sm:px-10 py-10 mt-24">
      <div className="text-center mb-14">
        <h2 className="text-5xl font-extrabold text-pink-700">Birthday Treats</h2>
        <p className="text-gray-600 text-lg mt-3 max-w-xl mx-auto">
          Find the sweetest birthday cake or treat to make your day special.
        </p>
      </div>

      <div className="mb-20 px-2 sm:px-8">
        <div className="bg-white rounded-3xl border border-pink-200 shadow-lg p-4 sm:p-6">
          <Slider {...settings}>
            {birthdayImages.map((img, idx) => (
              <div key={idx} className="px-3">
                <div className="h-72 sm:h-80 md:h-[26rem] rounded-2xl overflow-hidden border border-pink-300 bg-pink-100 shadow-xl flex items-center justify-center transition duration-300 hover:scale-[1.03] hover:shadow-pink-400/50">
                  <img
                    src={img}
                    alt={`Birthday ${idx}`}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => {
                      setSelectedImage(img);
                      setDesignImage(img);
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
          <label htmlFor="deliveryDate" className="flex items-center gap-2 text-gray-800 font-semibold">
            📅 Delivery Date
          </label>
          <input
            type="date"
            id="deliveryDate"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white bg-opacity-70"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="designImage" className="flex items-center gap-2 text-gray-800 font-semibold">
            <ImagePlus size={20} /> Design Image URL
          </label>
          <input
            type="text"
            id="designImage"
            value={designImage}
            onChange={(e) => setDesignImage(e.target.value)}
            placeholder="Paste image URL or select from above"
            className="w-full mt-2 p-3 border rounded-lg bg-white bg-opacity-70"
            required
          />
        </div>

        <div className="flex justify-center items-center">
          <button className="w-[300px] text-center text-pink-700 bg-white hover:bg-pink-700 hover:text-white py-3 px-6 rounded-lg font-bold transition-all duration-300">
          Confirm Order          </button>
        </div>
      </form>
    </div>
  );
};

export default BirthdayPage;
