import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { getMessagesOfUsers } from "@lib/actions/Chat.prisma";
import { useSession } from "next-auth/react";
import { getMessagesFromDB, saveMessagesToDB } from "@lib/indexedDB";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { data: session } = useSession();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation) return;
      setLoading(true);
      setMessages([]);

      try {
        // Step 1: Check IndexedDB first
        const cachedMessages = await getMessagesFromDB(
          selectedConversation.id,
          session?.user.id
        );

        if (cachedMessages.length > 0) {
          console.log("Using cached messages from IndexedDB");
          setMessages(cachedMessages);
        }

        // Step 2: Fetch from Prisma and update IndexedDB
        const fetchedMessages = await getMessagesOfUsers(
          selectedConversation.id,
          session?.user.id
        );

        if (fetchedMessages.length > 0) {
          setMessages(fetchedMessages);
          await saveMessagesToDB(
            selectedConversation.id,
            session?.user.id,
            fetchedMessages
          ); // Cache messages
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, setMessages]);

  return { messages, loading };
};

export default useGetMessages;
