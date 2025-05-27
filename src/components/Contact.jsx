// import React from "react";
// import { Phone, Mail } from "lucide-react";

// const Contact = () => {
//   return (
//     <div className="px-6 md:px-20 py-12 bg-white">
//       {/* Breadcrumb */}
//       <div className="text-sm text-gray-400 mb-8 text-left">
//   Home / <span className="text-black font-semibold">Contact</span>
// </div>


//       {/* Contact Sections */}
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Contact Info */}
//         <div className="flex flex-col gap-8 w-full md:w-1/3">
//           <div className="bg-white shadow-md rounded-md p-6 space-y-8">
//             {/* Call Us */}
//             <div>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="bg-pink-600 rounded-full p-3">
//                   <Phone className="text-white" />
//                 </div>
//                 <h3 className="font-bold text-lg">Call To Us</h3>
//               </div>
//               <p className="text-gray text-sm mb-2">
//                 We are available 24/7, 7 days a week.
//               </p>
//               <p className="text-black font-semibold text-sm">Phone: +88061112222</p>
//             </div>

//             {/* Line between */}
//             <hr className="border-gray-300" />

//             {/* Write To Us */}
//             <div>
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="bg-pink-600 rounded-full p-3">
//                   <Mail className="text-white" />
//                 </div>
//                 <h3 className="font-bold text-lg">Write To Us</h3>
//               </div>
//               <p className="text-gray-500 text-sm mb-2">
//                 Fill out our form and we will contact you within 24 hours.
//               </p>
//               <p className="text-black font-semibold text-sm">
//                 Emails: customer@exclusive.com
//               </p>
//               <p className="text-black font-semibold text-sm">
//                 Emails: support@exclusive.com
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Contact Form */}
//         <div className="flex-1 bg-white shadow-md rounded-md p-6">
//           <form className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <input
//                 type="text"
//                 placeholder="Your Name *"
//                 className="border border-gray-300 bg-gray-100 text-black rounded-md p-3 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
//               />
//               <input
//                 type="email"
//                 placeholder="Your Email *"
//                 className="border border-gray-300 bg-gray-100 text-black rounded-md p-3 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Your Phone *"
//                 className="border border-gray-300 bg-gray-100 rounded-md p-3 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
//               />
//             </div>
//             <textarea
//               rows="6"
//               placeholder="Your Message"
//               className="border border-gray-300 bg-gray-100 text-black rounded-md p-3 w-full text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
//             ></textarea>
//             <div className="flex justify-end">
//   <button
//     type="submit"
//     className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md font-semibold text-sm"
//   >
//     Send Message
//   </button>
// </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;

import React, { useState } from "react";
import { Phone, Mail } from "lucide-react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Contact Form", // ثابت حسب API
    message: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // ← اكتبي التوكن الصحيح هنا

  // إضافة دالة handleChange لتحديث حالة formData
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const token = localStorage.getItem('authToken'); // جلب التوكن من localStorage
    
      const res = await axios.post(
        "https://bakeryproject-1onw.onrender.com/api/contact",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // إضافة التوكن في الهيدر
          },
        }
      );
    
      if (res.data.success) {
        setSuccessMsg("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "Contact Form",
          message: "",
        });
      }
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };    

  return (
    <div className="px-6 md:px-20 py-12 bg-white">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-8 text-left">
        Home / <span className="text-black font-semibold">Contact</span>
      </div>

      {/* Contact Sections */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Contact Info */}
        <div className="flex flex-col gap-8 w-full md:w-1/3">
          <div className="bg-white shadow-md rounded-md p-6 space-y-8">
            {/* Call Us */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-pink-600 rounded-full p-3">
                  <Phone className="text-white" />
                </div>
                <h3 className="font-bold text-lg">Call To Us</h3>
              </div>
              <p className="text-gray text-sm mb-2">
                We are available 24/7, 7 days a week.
              </p>
              <p className="text-black font-semibold text-sm">
                Phone: +88061112222
              </p>
            </div>
            <hr className="border-gray-300" />
            {/* Write To Us */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-pink-600 rounded-full p-3">
                  <Mail className="text-white" />
                </div>
                <h3 className="font-bold text-lg">Write To Us</h3>
              </div>
              <p className="text-gray-500 text-sm mb-2">
                Fill out our form and we will contact you within 24 hours.
              </p>
              <p className="text-black font-semibold text-sm">
                Emails: customer@exclusive.com
              </p>
              <p className="text-black font-semibold text-sm">
                Emails: support@exclusive.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 bg-white shadow-md rounded-md p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {successMsg && (
              <p className="text-green-600 text-sm">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="text-red-600 text-sm">{errorMsg}</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                className="border border-gray-300 bg-gray-100 text-black rounded-md p-3 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email *"
                className="border border-gray-300 bg-gray-100 text-black rounded-md p-3 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Your Phone *"
                className="border border-gray-300 bg-gray-100 rounded-md p-3 text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <textarea
              name="message"
              rows="6"
              placeholder="Your Message"
              className="border border-gray-300 bg-gray-100 text-black rounded-md p-3 w-full text-sm focus:outline-none focus:border-black placeholder:text-gray-400"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-md font-semibold text-sm"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
