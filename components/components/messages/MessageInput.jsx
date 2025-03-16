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
    <form className="z-30 m-2" onSubmit={handleSubmit}>
      <div className="flex gap-1 relative">
        <div className="w-full flex gap-1 items-end  ">
          <textarea
            className="border text-sm block w-full p-2.5 bg-slate-200 rounded-2xl border-gray-600 text-black resize-none overflow-hidden"
            placeholder="Send a message"
            value={message}
            onChange={handleChange}
            rows={rows} // Dynamically adjust rows
          />
          <button
            type="submit"
            disabled={loading}
            className=" inset-y-0 end-0 flex items-center  disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send Message"
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              <Send className="text-white w-10 h-10 bg-primary rounded-full p-1 text-3xl" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default MessageInput;
