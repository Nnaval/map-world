"use client";

import MessageContainer from "@components/components/messages/MessageContainer";
import Sidebar from "@components/components/sidebar/Sidebar";
import {
  getMessagesOfUsers,
  getUserForConversation,
} from "@lib/actions/Chat.prisma";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import useConversation from "zustand/useConversation";

const chatPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    console.log("recienver id ", receiverId);
    if (receiverId && session) {
      const reciever = parseFloat(receiverId);
      // Fetch or prepare the conversation for the given receiverId.
      // This is an example; you would replace it with a call to your API.
      const fetchConversation = async () => {
        try {
          const data = await getUserForConversation(reciever);
          console.log("data from page router", data);
          if (data) {
            setSelectedConversation(data);
          } else {
            // Optionally handle the case where no conversation exists.
            toast(
              "these two guys have not chatted before , go back and implement the functionality"
            );
            setSelectedConversation(null);
          }
        } catch (error) {
          console.error("Error fetching conversation:", error);
        }
      };

      fetchConversation();
      console.log("selected convo ", selectedConversation);
    }
  }, [receiverId, setSelectedConversation, session]);
  return (
    <div className="flex h-screen w-full rounded-lg overflow-hidden bg-gray-400 bg-clip-padding  bg-opacity-0 z-30 ">
      <Sidebar />
      <MessageContainer />
    </div>
  );
};
export default chatPage;
