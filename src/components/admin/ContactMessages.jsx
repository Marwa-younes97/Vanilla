// import React, { useState, useEffect } from "react";
// import { FaReply, FaTrash } from "react-icons/fa";
// import Toast from "./Toast"; // ✅ تأكد من أن المسار صحيح حسب تنظيم مشروعك

// const ContactMessages = () => {
//   const [messages, setMessages] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentMessageId, setCurrentMessageId] = useState(null);
//   const [responseText, setResponseText] = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("Token not found!");
//           return;
//         }

//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/contact", {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();
//         if (data.success) {
//           setMessages(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, []);

//   const handleDeleteMessage = async (id) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/contact/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();
//     if (data.success) {
//       setMessages(messages.filter(msg => msg._id !== id));
//       setToastMessage("Message deleted successfully!");
//       setToastVisible(true);
//       setTimeout(() => {
//         setToastVisible(false);
//       }, 3000);
//     } else {
//       console.error("Failed to delete message");
//     }
//   };

//   const handleReplyClick = (id) => {
//     setCurrentMessageId(id);
//     setShowModal(true);
//   };

//   const handleReplyChange = (e) => {
//     setResponseText(e.target.value);
//   };

//   const handleSendReply = () => {
//     setMessages(
//       messages.map((msg) =>
//         msg._id === currentMessageId ? { ...msg, response: responseText, responded: true } : msg
//       )
//     );
//     setShowModal(false);
//     setResponseText("");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Customer Messages</h2>

//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="w-full bg-white rounded shadow">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-2 px-4">Name</th>
//               <th className="py-2 px-4">Email</th>
//               <th className="py-2 px-4">Phone</th>
//               <th className="py-2 px-4">Subject</th>
//               <th className="py-2 px-4">Message</th>
//               <th className="py-2 px-4">Date</th>
//               <th className="py-2 px-4">Reply</th>
//               <th className="py-2 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.map((msg) => (
//               <tr key={msg._id} className="text-center border-t">
//                 <td className="py-2 px-4">{msg.name}</td>
//                 <td className="py-2 px-4">{msg.email}</td>
//                 <td className="py-2 px-4">{msg.phone}</td>
//                 <td className="py-2 px-4">{msg.subject}</td>
//                 <td className="py-2 px-4">{msg.message}</td>
//                 <td className="py-2 px-4">
//                   {new Date(msg.date).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4">
//                   {msg.responded ? (
//                     <span className="text-green-600 font-medium">Replied</span>
//                   ) : (
//                     <button
//                       onClick={() => handleReplyClick(msg._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaReply /> Reply
//                     </button>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleDeleteMessage(msg._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {messages.length === 0 && (
//           <div className="text-center py-6 text-gray-500">
//             No messages available.
//           </div>
//         )}
//       </div>

//       {/* Reply Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Reply to Message</h3>
//             <textarea
//               value={responseText}
//               onChange={handleReplyChange}
//               className="w-full p-2 border rounded mb-4"
//               placeholder="Type your reply here..."
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleSendReply}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Send Reply
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Notification */}
//       <Toast visible={toastVisible} message={toastMessage} />
//     </div>
//   );
// };

// export default ContactMessages;

// import React, { useState, useEffect } from "react";
// import { FaReply, FaTrash } from "react-icons/fa";
// import Toast from "./Toast";

// const ContactMessages = () => {
//   const [messages, setMessages] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentMessageId, setCurrentMessageId] = useState(null);
//   const [responseText, setResponseText] = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   // ✅ جعل fetchMessages دالة مستقلة قابلة لإعادة الاستخدام
//   const fetchMessages = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("Token not found!");
//         return;
//       }

//       const response = await fetch("https://bakeryproject-1onw.onrender.com/api/contact", {
//         method: "GET",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (data.success) {
//         setMessages(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching messages:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const handleDeleteMessage = async (id) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/contact/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     if (data.success) {
//       setMessages(messages.filter((msg) => msg._id !== id));
//       setToastMessage("Message deleted successfully!");
//       setToastVisible(true);
//       setTimeout(() => {
//         setToastVisible(false);
//       }, 3000);
//     } else {
//       console.error("Failed to delete message");
//     }
//   };

//   const handleReplyClick = (id) => {
//     setCurrentMessageId(id);
//     setShowModal(true);
//   };

//   const handleReplyChange = (e) => {
//     setResponseText(e.target.value);
//   };

//   // ✅ إرسال الرد وتحديث الرسائل مباشرة من السيرفر
//   const handleSendReply = async () => {
//     const token = localStorage.getItem("token");
//     if (!responseText.trim()) return;

//     try {
//       const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/contact/reply/${currentMessageId}`, {
//         method: "POST",
//         headers: {
//           "Authorization": `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reply: responseText }),
//       });

//       const data = await response.json();
//       if (data.success) {
//         await fetchMessages(); // ✅ تحديث من الخادم
//         setToastMessage("Reply sent successfully!");
//         setToastVisible(true);
//         setTimeout(() => setToastVisible(false), 3000);
//       }
//     } catch (error) {
//       console.error("Failed to send reply:", error);
//     }

//     setShowModal(false);
//     setResponseText("");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Customer Messages</h2>

//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="table w-full bg-white rounded shadow">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-2 px-4">Name</th>
//               <th className="py-2 px-4">Email</th>
//               <th className="py-2 px-4">Phone</th>
//               <th className="py-2 px-4">Subject</th>
//               <th className="py-2 px-4">Message</th>
//               <th className="py-2 px-4">Date</th>
//               <th className="py-2 px-4">Reply</th>
//               <th className="py-2 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.map((msg) => (
//               <tr key={msg._id} className="text-center border-t">
//                 <td className="py-2 px-4">{msg.name}</td>
//                 <td className="py-2 px-4">{msg.email}</td>
//                 <td className="py-2 px-4">{msg.phone}</td>
//                 <td className="py-2 px-4">{msg.subject}</td>
//                 <td className="py-2 px-4">{msg.message}</td>
//                 <td className="py-2 px-4">
//                   {new Date(msg.date).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4">
//                   {msg.reply ? (
//                     <details>
//                       <summary className="cursor-pointer text-green-600 font-medium">
//                         تم الرد
//                       </summary>
//                       <div className="text-sm text-gray-700 mt-1 text-start px-2">
//                         <div><strong>الرد:</strong> {msg.reply}</div>
//                         <div><strong>تاريخ الرد:</strong> {new Date(msg.repliedAt).toLocaleString()}</div>
//                       </div>
//                     </details>
//                   ) : (
//                     <button
//                       onClick={() => handleReplyClick(msg._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaReply /> رد
//                     </button>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleDeleteMessage(msg._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> حذف
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {messages.length === 0 && (
//           <div className="text-center py-6 text-gray-500">
//             لا توجد رسائل حالياً.
//           </div>
//         )}
//       </div>

//       {/* مودال الرد */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">رد على الرسالة</h3>
//             <textarea
//               value={responseText}
//               onChange={handleReplyChange}
//               className="w-full p-2 border rounded mb-4"
//               placeholder="اكتب الرد هنا..."
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleSendReply}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 إرسال الرد
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
//               >
//                 إلغاء
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* إشعار Toast */}
//       <Toast visible={toastVisible} message={toastMessage} />
//     </div>
//   );
// };

// export default ContactMessages;

import React, { useState, useEffect } from "react";
import { FaReply, FaTrash } from "react-icons/fa";
import Toast from "./Toast";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Modal to show reply details
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyDate, setReplyDate] = useState("");

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token not found!");
        return;
      }

      const response = await fetch(
        "https://bakeryproject-1onw.onrender.com/api/contact",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDeleteMessage = async (id) => {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `https://bakeryproject-1onw.onrender.com/api/contact/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.success) {
      setMessages(messages.filter((msg) => msg._id !== id));
      setToastMessage("Message deleted successfully!");
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } else {
      console.error("Failed to delete message");
    }
  };

  const handleReplyClick = (id) => {
    setCurrentMessageId(id);
    setShowModal(true);
  };

  const handleReplyChange = (e) => {
    setResponseText(e.target.value);
  };

  const handleSendReply = async () => {
    const token = localStorage.getItem("authToken");
    if (!responseText.trim()) return;

    try {
      const response = await fetch(
        `https://bakeryproject-1onw.onrender.com/api/contact/reply/${currentMessageId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reply: responseText }),
        }
      );

      const data = await response.json();
      if (data.success) {
        await fetchMessages();
        setToastMessage("Reply sent successfully!");
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    }

    setShowModal(false);
    setResponseText("");
  };

  const handleShowReplyModal = (reply, date) => {
    setReplyContent(reply);
    setReplyDate(date);
    setShowReplyModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-pink-700">
        Customer Messages
      </h2>

      <div className="overflow-x-auto rounded shadow-md border border-gray-200">
        <table className=" table w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-pink-100 text-pink-800">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Phone</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Message</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Reply</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg._id} className="text-center border-t">
                <td className="py-2 px-4">{msg.name}</td>
                <td className="py-2 px-4">{msg.email}</td>
                <td className="py-2 px-4">{msg.phone}</td>
                <td className="py-2 px-4">{msg.subject}</td>
                <td className="py-2 px-4">{msg.message}</td>
                <td className="py-2 px-4">
                  {new Date(msg.date).toLocaleString()}
                </td>
                <td className="py-2 px-4">
                  {msg.reply ? (
                    <button
                      onClick={() =>
                        handleShowReplyModal(msg.reply, msg.repliedAt)
                      }
                      className="text-green-600 font-medium underline hover:text-green-800"
                    >
                      Replied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReplyClick(msg._id)}
                      className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
                    >
                      <FaReply /> Reply
                    </button>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {messages.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            No messages available.
          </div>
        )}
      </div>

      {/* Modal to send reply */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reply to Message</h3>
            <textarea
              value={responseText}
              onChange={handleReplyChange}
              className="w-full p-2 border rounded mb-4"
              placeholder="Type your reply here..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSendReply}
                className="px-4 py-2 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
              >
                Send Reply
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to view reply */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-lg font-bold mb-4 text-green-700">
              Reply Details
            </h3>
            <div className="text-sm text-gray-800 mb-2">
              <strong>Reply:</strong>
              <p className="mt-1">{replyContent}</p>
            </div>
            <div className="text-sm text-gray-500">
              <strong>Replied At:</strong>{" "}
              {new Date(replyDate).toLocaleString()}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowReplyModal(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to view reply */}
      {/* {showReplyModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="relative bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
      
      <button
        onClick={() => setShowReplyModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>

      <h3 className="text-lg font-bold mb-4 text-green-700">Reply Details</h3>
      <div className="text-sm text-gray-800 mb-2">
        <strong>Reply:</strong>
        <p className="mt-1">{replyContent}</p>
      </div>
      <div className="text-sm text-gray-500">
        <strong>Replied At:</strong> {new Date(replyDate).toLocaleString()}
      </div>
    </div>
  </div>
)} */}

      {/* Toast Notification */}
      <Toast visible={toastVisible} message={toastMessage} />
    </div>
  );
};

export default ContactMessages;

// // -------------------- with api but without reply api---------------------
// import React, { useState, useEffect } from "react";
// import { FaReply, FaTrash } from "react-icons/fa";

// const ContactMessages = () => {
//   const [messages, setMessages] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [currentMessageId, setCurrentMessageId] = useState(null);
//   const [responseText, setResponseText] = useState("");
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("Token not found!");
//           return;
//         }

//         const response = await fetch("https://bakeryproject-1onw.onrender.com/api/contact", {
//           method: "GET",
//           headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         const data = await response.json();
//         if (data.success) {
//           setMessages(data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, []);

//   const handleDeleteMessage = async (id) => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(`https://bakeryproject-1onw.onrender.com/api/contact/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const data = await response.json();
//     if (data.success) {
//       setMessages(messages.filter(msg => msg._id !== id));
//       setToastMessage("Message deleted successfully!");
//       setToastVisible(true);
//       setTimeout(() => {
//         setToastVisible(false);
//       }, 3000);
//     } else {
//       console.error("Failed to delete message");
//     }
//   };

//   const handleReplyClick = (id) => {
//     setCurrentMessageId(id);
//     setShowModal(true);
//   };

//   const handleReplyChange = (e) => {
//     setResponseText(e.target.value);
//   };

//   const handleSendReply = () => {
//     setMessages(
//       messages.map((msg) =>
//         msg._id === currentMessageId ? { ...msg, response: responseText, responded: true } : msg
//       )
//     );
//     setShowModal(false);
//     setResponseText("");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Customer Messages</h2>

//       <div className="overflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="w-full bg-white rounded shadow">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-2 px-4">Name</th>
//               <th className="py-2 px-4">Email</th>
//               <th className="py-2 px-4">Phone</th>
//               <th className="py-2 px-4">Subject</th>
//               <th className="py-2 px-4">Message</th>
//               <th className="py-2 px-4">Date</th>
//               <th className="py-2 px-4">Reply</th>
//               <th className="py-2 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.map((msg) => (
//               <tr key={msg._id} className="text-center border-t">
//                 <td className="py-2 px-4">{msg.name}</td>
//                 <td className="py-2 px-4">{msg.email}</td>
//                 <td className="py-2 px-4">{msg.phone}</td>
//                 <td className="py-2 px-4">{msg.subject}</td>
//                 <td className="py-2 px-4">{msg.message}</td>
//                 <td className="py-2 px-4">
//                   {new Date(msg.date).toLocaleString()}
//                 </td>
//                 <td className="py-2 px-4">
//                   {msg.responded ? (
//                     <span className="text-green-600 font-medium">Replied</span>
//                   ) : (
//                     <button
//                       onClick={() => handleReplyClick(msg._id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaReply /> Reply
//                     </button>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleDeleteMessage(msg._id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash /> Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {messages.length === 0 && (
//           <div className="text-center py-6 text-gray-500">
//             No messages available.
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Reply to Message</h3>
//             <textarea
//               value={responseText}
//               onChange={handleReplyChange}
//               className="w-full p-2 border rounded mb-4"
//               placeholder="Type your reply here..."
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleSendReply}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Send Reply
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Toast Notification */}
//       {toastVisible && (
//         <div className="fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-xs w-full">
//             <div className="border-4 border-green-600 bg-white text-green-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="w-8 h-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M5 13l4 4L19 7"
//                 />
//               </svg>
//             </div>
//             <p className="text-lg font-semibold text-green-600">{toastMessage}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactMessages;
// // -------------------- with api but without reply api---------------------

// ------------------------- Without api -------------------------
// import React, { useState } from "react";
// import { FaReply , FaTrash } from "react-icons/fa";

// const ContactMessages = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       name: "Ahmed Mohamed",
//       email: "ahmed@example.com",
//       subject: "Order Inquiry",
//       message: "When will my order be delivered?",
//       date: "2025-04-25",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 2,
//       name: "Sara Ali",
//       email: "sara@example.com",
//       subject: "Product Issue",
//       message: "The product arrived damaged. What should I do?",
//       date: "2025-04-24",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 3,
//       name: "Khaled Samir",
//       email: "khaled@example.com",
//       subject: "Feedback",
//       message: "Excellent service, thank you!",
//       date: "2025-04-23",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 4,
//       name: "Mahmoud Hosny",
//       email: "mahmoud@example.com",
//       subject: "Return Request",
//       message: "I want to return the product due to mismatch with description.",
//       date: "2025-04-22",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 5,
//       name: "Laila Mostafa",
//       email: "leila@example.com",
//       subject: "Offer Inquiry",
//       message: "Are there any special offers on bread?",
//       date: "2025-04-21",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 6,
//       name: "Youssef Gamal",
//       email: "youssef@example.com",
//       subject: "Payment Issue",
//       message: "I faced an issue while trying to pay with my credit card.",
//       date: "2025-04-20",
//       response: "",
//       responded: false,
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false);
//   const [currentMessageId, setCurrentMessageId] = useState(null);
//   const [responseText, setResponseText] = useState("");

//   const handleDelete = (id) => {
//     setMessages(messages.filter((msg) => msg.id !== id));
//   };

//   const handleReplyClick = (id) => {
//     setCurrentMessageId(id);
//     setShowModal(true);
//   };

//   const handleReplyChange = (e) => {
//     setResponseText(e.target.value);
//   };

//   const handleSendReply = () => {
//     setMessages(
//       messages.map((msg) =>
//         msg.id === currentMessageId ? { ...msg, response: responseText, responded: true } : msg
//       )
//     );
//     setShowModal(false);
//     setResponseText("");
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Customer Messages</h2>

//       <div className="verflow-x-auto rounded shadow-md border border-gray-200">
//         <table className="w-full bg-white rounded shadow">
//           <thead>
//             <tr className="bg-pink-100 text-pink-800">
//               <th className="py-2 px-4">Name</th>
//               <th className="py-2 px-4">Email</th>
//               <th className="py-2 px-4">Subject</th>
//               <th className="py-2 px-4">Message</th>
//               <th className="py-2 px-4">Date</th>
//               <th className="py-2 px-4">Reply</th>
//               <th className="py-2 px-4">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.map((msg) => (
//               <tr key={msg.id} className="text-center border-t">
//                 <td className="py-2 px-4">{msg.name}</td>
//                 <td className="py-2 px-4">{msg.email}</td>
//                 <td className="py-2 px-4">{msg.subject}</td>
//                 <td className="py-2 px-4">{msg.message}</td>
//                 <td className="py-2 px-4">{msg.date}</td>
//                 <td className="py-2 px-4">
//                   {msg.responded ? (
//                     <span className="text-green-600 font-medium">Replied</span>
//                   ) : (
//                     <button
//                       onClick={() => handleReplyClick(msg.id)}
//                       className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                      <FaReply /> Reply
//                     </button>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <div className="flex justify-center gap-2">
//                     <button
//                       onClick={() => handleDelete(msg.id)}
//                       className="flex items-center gap-1 bg-gray-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
//                     >
//                       <FaTrash />Delete
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {messages.length === 0 && (
//           <div className="text-center py-6 text-gray-500">
//             No messages available.
//           </div>
//         )}
//       </div>

//       {/* Reply Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">Reply to Message</h3>
//             <textarea
//               value={responseText}
//               onChange={handleReplyChange}
//               className="w-full p-2 border rounded mb-4"
//               placeholder="Type your reply here..."
//             />
//             <div className="flex justify-end space-x-2">
//               <button
//                 onClick={handleSendReply}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//               >
//                 Send Reply
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactMessages;
// ------------------------- Without api -------------------------

// ------------------------نسخه باللغه العربيه------------------------
// import React, { useState } from "react";

// const ContactMessages = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       name: "أحمد محمد",
//       email: "ahmed@example.com",
//       subject: "استفسار عن الطلب",
//       message: "متى سيتم توصيل طلبي؟",
//       date: "2025-04-25",
//       response: "", // إضافة حقل الرد
//       responded: false, // حالة الرد
//     },
//     {
//       id: 2,
//       name: "سارة علي",
//       email: "sara@example.com",
//       subject: "مشكلة في المنتج",
//       message: "المنتج وصل تالف، ماذا أفعل؟",
//       date: "2025-04-24",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 3,
//       name: "خالد سمير",
//       email: "khaled@example.com",
//       subject: "رأي",
//       message: "خدمة ممتازة جدًا، شكرًا لكم!",
//       date: "2025-04-23",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 4,
//       name: "محمود حسني",
//       email: "mahmoud@example.com",
//       subject: "طلب استرجاع",
//       message: "أريد استرجاع المنتج بسبب عدم مطابقته للوصف.",
//       date: "2025-04-22",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 5,
//       name: "ليلى مصطفى",
//       email: "leila@example.com",
//       subject: "استفسار عن العروض",
//       message: "هل هناك أي عروض خاصة على الخبز؟",
//       date: "2025-04-21",
//       response: "",
//       responded: false,
//     },
//     {
//       id: 6,
//       name: "يوسف جمال",
//       email: "youssef@example.com",
//       subject: "مشكلة في الدفع",
//       message: "واجهت مشكلة أثناء محاولة الدفع عبر البطاقات الائتمانية.",
//       date: "2025-04-20",
//       response: "",
//       responded: false,
//     },
//   ]);

//   const [showModal, setShowModal] = useState(false); // لإظهار النافذة المنبثقة
//   const [currentMessageId, setCurrentMessageId] = useState(null); // لتحديد الرسالة التي يتم الرد عليها
//   const [responseText, setResponseText] = useState(""); // لتخزين الرد

//   const handleDelete = (id) => {
//     setMessages(messages.filter((msg) => msg.id !== id));
//   };

//   const handleReplyClick = (id) => {
//     setCurrentMessageId(id);
//     setShowModal(true); // عرض النافذة المنبثقة عند الضغط على زر الرد
//   };

//   const handleReplyChange = (e) => {
//     setResponseText(e.target.value);
//   };

//   const handleSendReply = () => {
//     setMessages(
//       messages.map((msg) =>
//         msg.id === currentMessageId ? { ...msg, response: responseText, responded: true } : msg
//       )
//     );
//     setShowModal(false); // إغلاق النافذة المنبثقة بعد إرسال الرد
//     setResponseText(""); // مسح النص بعد الرد
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">رسائل العملاء</h2>

//       <div className="overflow-x-auto">
//         <table className="w-full bg-white rounded shadow">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700">
//               <th className="py-2 px-4">الاسم</th>
//               <th className="py-2 px-4">البريد الإلكتروني</th>
//               <th className="py-2 px-4">العنوان</th>
//               <th className="py-2 px-4">الرسالة</th>
//               <th className="py-2 px-4">التاريخ</th>
//               <th className="py-2 px-4">الرد</th>
//               <th className="py-2 px-4">الإجراء</th>
//             </tr>
//           </thead>
//           <tbody>
//             {messages.map((msg) => (
//               <tr key={msg.id} className="text-center border-t">
//                 <td className="py-2 px-4">{msg.name}</td>
//                 <td className="py-2 px-4">{msg.email}</td>
//                 <td className="py-2 px-4">{msg.subject}</td>
//                 <td className="py-2 px-4">{msg.message}</td>
//                 <td className="py-2 px-4">{msg.date}</td>
//                 <td className="py-2 px-4">
//                   {msg.responded ? (
//                     <p className="text-green-500">تم الرد</p>
//                   ) : (
//                     <button
//                       onClick={() => handleReplyClick(msg.id)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded"
//                     >
//                       الرد
//                     </button>
//                   )}
//                 </td>
//                 <td className="py-2 px-4">
//                   <button
//                     onClick={() => handleDelete(msg.id)}
//                     className="text-red-600 hover:underline"
//                   >
//                     حذف
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {messages.length === 0 && (
//           <div className="text-center py-6 text-gray-500">
//             لا توجد رسائل حالياً.
//           </div>
//         )}
//       </div>

//       {/* النافذة المنبثقة للرد */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded shadow-lg w-96">
//             <h3 className="text-lg font-semibold mb-4">الرد على الرسالة</h3>
//             <textarea
//               value={responseText}
//               onChange={handleReplyChange}
//               className="w-full p-2 border rounded mb-4"
//               placeholder="اكتب الرد هنا..."
//             />
//             <div className="flex justify-end">
//               <button
//                 onClick={handleSendReply}
//                 className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//               >
//                 إرسال الرد
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-black rounded"
//               >
//                 إغلاق
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ContactMessages;
// // ------------------------نسخه باللغه العربيه------------------------
