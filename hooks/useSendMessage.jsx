import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { sendMessageToUser } from "@lib/actions/Chat.prisma";
import socket from "@components/socket/Socket";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { data: session, status } = useSession();

  const sendMessage = async (message) => {
    if (!selectedConversation) return;
    setLoading(true);
    try {
      const data = await sendMessageToUser({
        message: message,
        receiverId: selectedConversation.id,
        senderId: session.user.id,
      });

      // Emit the event to send a private message.
      socket.emit("private_message", {
        receiverId: selectedConversation.id, // the target user's ID
        message: data,
      });

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};
export default useSendMessage;
