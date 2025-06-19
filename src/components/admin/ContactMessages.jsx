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
