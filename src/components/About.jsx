import React from 'react';
import { Store, ShoppingBag, Wallet, DollarSign, Twitter, Instagram, Linkedin, Truck, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="font-sans pt-24 bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-pink-50 to-rose-50 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Sweet Delights Journey</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From humble beginnings to becoming your favorite sweet destination
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 border-t-4 border-l-4 border-pink-400"></div>
              <video 
                autoPlay
                loop
                muted
                playsInline
                className="rounded-xl shadow-2xl w-full h-auto"
              >
                <source src="https://milkbarstore.com/cdn/shop/videos/c/vp/70148322b06846cb95f7d7839a094d52/70148322b06846cb95f7d7839a094d52.SD-480p-1.5Mbps-23487163.mp4?v=0" 
                type="video/mp4" />
              </video>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 border-b-4 border-r-4 border-pink-400"></div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 relative inline-block">
              <span className="relative z-10">Our Story</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-pink-100 z-0 opacity-60"></span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Launched in 2015, our store offers the finest selection of sweets and desserts in the region.
              We provide our customers with a wide variety of luxurious treats, ranging from premium chocolates to cakes and specialty snacks.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              With more than <span className="font-semibold text-pink-600">10,000 unique products</span>, we are growing rapidly. Our store offers a diverse assortment of sweets that cater to all tastes and occasions.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-10 rounded-2xl shadow-sm border border-pink-100 transform hover:scale-[1.01] transition duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-pink-600 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            To delight our customers by offering an exceptional variety of premium sweets and desserts, while supporting local businesses and creating unforgettable experiences for every occasion.
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-10 rounded-2xl shadow-sm border border-pink-100 transform hover:scale-[1.01] transition duration-300">
          <div className="flex items-center mb-6">
            <div className="bg-pink-600 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">
            To become the leading online destination for sweet lovers across the region, known for quality, innovation, and outstanding customer satisfaction.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">By The Numbers</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="text-pink-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">10.5k</div>
              <div className="text-gray-500 uppercase text-sm tracking-wider">Active Sellers</div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="text-pink-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">33k</div>
              <div className="text-gray-500 uppercase text-sm tracking-wider">Monthly Sales</div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="text-pink-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">45.5k</div>
              <div className="text-gray-500 uppercase text-sm tracking-wider">Happy Customers</div>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center transform hover:-translate-y-2 transition duration-300">
              <div className="bg-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="text-pink-600" size={32} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">25k</div>
              <div className="text-gray-500 uppercase text-sm tracking-wider">Annual Sales</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto mb-16">
            We go the extra mile to make you happy
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="text-pink-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-center text-gray-900 mb-3">Free & Fast Delivery</h4>
              <p className="text-gray-600 text-center">
                Free delivery for all orders over $140 with our priority shipping service
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="text-pink-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-center text-gray-900 mb-3">24/7 Support</h4>
              <p className="text-gray-600 text-center">
                Our friendly customer service team is always ready to help you
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="text-pink-600" size={28} />
              </div>
              <h4 className="text-xl font-bold text-center text-gray-900 mb-3">Satisfaction Guaranteed</h4>
              <p className="text-gray-600 text-center">
                We offer 30-day money back guarantee on all our products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;