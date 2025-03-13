import { useEffect } from "react";

import socket from "@components/socket/Socket";
import { toast } from "sonner";
import useConversation from "zustand/useConversation";
import { saveMessagesToDB } from "@lib/indexedDB";
import { useSession } from "next-auth/react";

const useListenMessages = () => {
  const { messages, setMessages } = useConversation();

  const { data: session } = useSession();
  useEffect(() => {
    socket.on("newMessage", async (newMessage) => {
      console.log("New message --------->>>>>>", newMessage);
      toast("a new message was recieved");

      const updatedMessages = [...messages, newMessage.message];
      setMessages(updatedMessages);

      const senderId = newMessage?.senderId;
      const receiverId = session?.user?.id;
      // Save new message to IndexedDB
      await saveMessagesToDB(receiverId, senderId, updatedMessages);
      console.log("messages context", updatedMessages);
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
