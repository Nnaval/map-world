import { getRandomEmoji } from "@constants/arrays";
import useGetConversations from "hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = () => {
  const { conversations, loading } = useGetConversations();
  // console.log('conserrrr array' , conversations)
  return (
    <div className="py-2 flex flex-col overflow-auto">
      {conversations?.map((conversation) => (
        <Conversation
          key={conversation.id}
          conversation={conversation}
          emoji={getRandomEmoji()}
        />
      ))}
      {loading ? <span className="loading loading-spinner mx-auto" /> : null}
    </div>
  );
};
export default Conversations;
