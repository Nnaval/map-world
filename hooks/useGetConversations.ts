import { getUsersForSidebar } from "@lib/actions/Chat.prisma";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useGetConversations = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				const res = await getUsersForSidebar();
				console.log('res convo', res)
				setConversations(res);
				console.log('res convo was set', res)
			} catch (error) {
				console.log('error  during convo getting', error)
				toast.error(error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};
export default useGetConversations;
