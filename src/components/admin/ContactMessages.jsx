import React, { useState, useEffect } from "react";
import { FaReply, FaTrash, FaCheck } from "react-icons/fa";
import Toast from "./Toast";

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const messagesPerPage = 10;

const totalPages = Math.ceil(messages.length / messagesPerPage);


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

const indexOfLastMessage = currentPage * messagesPerPage;
const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);


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
// console.log(`id=> ${id}`);
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
console.log(currentMessageId);
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
        <table className=" table min-w-[1700px] bg-white rounded shadow">
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
            {currentMessages.map((msg) => (
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
                      // className="text-green-600 font-medium underline hover:text-green-800"
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1 px-2 rounded w-20 items-center justify-center"
                    >
                      <FaCheck />Replied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReplyClick(msg._id)}
                      className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-xs py-1 px-2 rounded w-20 items-center justify-center"
                    >
                      <FaReply /> Reply
                    </button>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded"
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
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
      <h3 className="text-xl font-semibold text-pink-600 mb-4 text-center">
        Reply to Message
      </h3>

      <textarea
        value={responseText}
        onChange={handleReplyChange}
        className="w-full p-3 border rounded-lg mb-4 resize-none focus:outline-pink-500"
        rows={6}
        placeholder="Type your reply here..."
      />

      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={() => setShowModal(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSendReply}
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-md"
        >
          Send Reply
        </button>
      </div>
    </div>
  </div>
)}
{showReplyModal && (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl animate-fade-in">
      <h2 className="text-xl font-semibold text-green-700 mb-4 text-center">
        Reply Details
      </h2>

      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        <div className="border rounded-lg px-4 py-3 bg-gray-50 shadow-sm">
          <p className="text-sm">
            <span className="font-medium text-gray-700">Reply:</span>
            <br />
            {replyContent}
          </p>
        </div>

        <div className="border rounded-lg px-4 py-3 bg-gray-50 shadow-sm">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Replied At:</span>{" "}
            {new Date(replyDate).toLocaleString()}
          </p>
        </div>
      </div>

      {/* زر الإغلاق */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowReplyModal(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      {/* Toast Notification */}
      <Toast visible={toastVisible} message={toastMessage} />
      {messages.length > 0 && (
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
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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

export default ContactMessages;
