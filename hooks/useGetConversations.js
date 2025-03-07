import { getUsersForSidebar } from "@lib/actions/Chat.prisma";
import { openDatabase } from "@lib/indexedDB";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);

  // 🔥 Ensure database is properly initialized

  // Load cached conversations
  const loadCachedConversations = async () => {
    try {
      const db = await openDatabase();
      if (!db) return;

      if (!db.objectStoreNames.contains("conversations")) {
        console.warn("Object store not found, skipping cache load.");
        return;
      }

      const tx = db.transaction("conversations", "readonly");
      const store = tx.objectStore("conversations");
      const cachedData = await store.getAll();

      if (cachedData.length > 0) {
        setConversations(cachedData);
      }
    } catch (error) {
      console.error("Error loading cached conversations:", error);
    }
  };

  // Save conversations in IndexedDB
  const saveConversationsToDB = async (data) => {
    try {
      const db = await openDatabase();
      if (!db) return;

      if (!db.objectStoreNames.contains("conversations")) {
        console.warn("Object store missing, skipping save.");
        return;
      }

      const tx = db.transaction("conversations", "readwrite");
      const store = tx.objectStore("conversations");
      await store.clear(); // Clear old data
      data.forEach((item) => store.put(item)); // Store new data
    } catch (error) {
      console.error("Error saving conversations to IndexedDB:", error);
    }
  };

  useEffect(() => {
    const getConversations = async () => {
      await openDatabase(); // Ensure DB is initialized
      await loadCachedConversations(); // Load cached data first

      if (navigator.onLine) {
        setLoading(true);
        try {
          const res = await getUsersForSidebar();
          console.log("Fetched conversations:", res);
          setConversations(res);
          await saveConversationsToDB(res); // Save fresh data to IndexedDB
        } catch (error) {
          console.error("Error fetching conversations:", error);
          toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
