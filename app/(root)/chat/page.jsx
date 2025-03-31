"use client";

import MessageContainer from "@components/components/messages/MessageContainer";
import Sidebar from "@components/components/sidebar/Sidebar";
import { getUserForConversation } from "@lib/actions/Chat.prisma";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import useConversation from "zustand/useConversation";

const ChatPage = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    if (!receiverId || !session) {
      setSelectedConversation(null); // Reset when no receiverId
      return;
    }

    const fetchConversation = async () => {
      try {
        const reciever = parseFloat(receiverId);
        const data = await getUserForConversation(reciever);

        if (data) {
          setSelectedConversation(data);
        } else {
          toast("These two users haven't chatted before.");
          setSelectedConversation(null);
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    };

    fetchConversation();
  }, [receiverId, session]); // ✅ Dependency array listens for `receiverId` changes

  return (
    <div className="flex h-screen w-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding bg-opacity-0 z-30">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};

export default ChatPage;
