import useSendMessage from "hooks/useSendMessage";
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState(1);
  const { loading, sendMessage } = useSendMessage();

  const maxRows = 5; // Maximum rows allowed

  const handleChange = (e) => {
    const textareaLineHeight = 24; // Approximate height per line
    const previousRows = e.target.rows;
    e.target.rows = 1; // Reset rows to recalculate

    const currentRows = Math.floor(e.target.scrollHeight / textareaLineHeight);
    if (currentRows === previousRows) {
      e.target.rows = currentRows;
    }

    setMessage(e.target.value);
    setRows(currentRows < maxRows ? currentRows : maxRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage("");
    setRows(1); // Reset to 1 row after sending
  };

  return (
    <form className="z-30" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <textarea
          className="border text-sm rounded-t block w-full p-2.5 bg-gray-700 border-gray-600 text-white resize-none overflow-hidden"
          placeholder="Send a message"
          value={message}
          onChange={handleChange}
          rows={rows} // Dynamically adjust rows
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-0 end-0 flex items-center pr-3 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send Message"
        >
          {loading ? (
            <span className="loading loading-spinner" />
          ) : (
            <Send className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
