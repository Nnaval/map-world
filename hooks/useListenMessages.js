import { useEffect } from "react";

import socket from "@components/socket/Socket";
import { toast } from "sonner";
import useConversation from "zustand/useConversation";

const useListenMessages = () => {
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket.on("newMessage", async (newMessage) => {
      toast("a new message was recieved");
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      // Save new message to IndexedDB
      await saveMessagesToDB(receiverId, senderId, updatedMessages);
      console.log("messages context", messages);
      newMessage.shouldShake = true;
      const sound = new Audio("/sounds/notification.mp3");
      sound.play();
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, setMessages]);
};
export default useListenMessages;
