import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoSend } from "react-icons/io5"; // Import Send icon
import API_BASE_URL from "../config";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

   useEffect(() => {
     // Scroll to the bottom whenever messages change
     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);
  
  const sendMessage = async () => {
    if (!input.trim()) return;

  const fileUrl = localStorage.getItem("fileUrl"); // ✅ Retrieve file URL
  if (!fileUrl) {
    console.error("No file URL found in localStorage");
    return alert("No PDF file uploaded!");
  }
    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]); 

    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: input,
        fileUrl,
      });

      setMessages((prev) => [...prev, { text: res.data.reply, sender: "ai" }]);
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setInput(""); 
  };

  return (
    <div className="flex flex-col h-full w-full ">
      {/* Chat Messages Window */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`max-w-xs p-3 rounded-lg shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </p>
          </div>
        ))}
        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input at Bottom */}
      <div className="p-3 bg-white shadow-md flex items-center w-full max-w-full gap-2 flex-wrap">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border-none outline-none p-2 text-lg w-full min-w-0"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="text-blue-500 hover:text-blue-700 flex-shrink-0 p-2"
        >
          <IoSend size={24} />
        </button>
      </div>
    </div>
  );
}
