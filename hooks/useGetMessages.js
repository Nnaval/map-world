import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { getMessagesOfUsers } from "@lib/actions/Chat.prisma";
import { useSession } from "next-auth/react";

const useGetMessages = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation } = useConversation();
  const { data: session, status } = useSession();

	useEffect(() => {
		const getMessages = async () => {
			if (!selectedConversation) return;
			setLoading(true);
			setMessages([]);
			try {
				const data = await  getMessagesOfUsers(selectedConversation.id , session?.user.id);
				// const data = await res.json();
				// if (!res.ok) throw new Error(data.error || "An error occurred");
				setMessages(data);
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
