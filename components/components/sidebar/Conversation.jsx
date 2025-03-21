// import { useSocketContext } from "../../context/SocketContext";
// import useConversation from "../../zustand/useConversation";

import { useOnlineUsers } from "@components/providers/OnlineUsersProvider";
import Image from "next/image";
import useConversation from "zustand/useConversation";

const Conversation = ({ conversation, emoji }) => {
  const { setSelectedConversation, selectedConversation } = useConversation();
  const isSelected = selectedConversation?.id === conversation.id;

  // const { onlineUsers } = useSocketContext();
  const onlineUsers = useOnlineUsers();
  // console.log("Online users for COnversation", onlineUsers);
  const isUserActive = onlineUsers.find(
    (onlineUser) => onlineUser.userId === conversation.id
  );

  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2
				 py-1 cursor-pointer ${isSelected ? "md:bg-sky-500" : ""}`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isUserActive ? "online" : ""}`}>
          <div className="w-14 h-14 md:w-12 rounded-full relative">
            <Image
              src={
                conversation.picture ||
                "https://randomuser.me/api/portraits/men/1.jpg"
              }
              alt="dp"
              width={20}
              height={20}
              className="w-14 h-14 rounded-full"
            />
            {isUserActive && (
              <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full absolute top-0 right-1"></div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-semibold text-slate-600  text-sm md:text-md">
              {conversation.name}
            </p>
            <span className="text-xl hidden md:inline-block">{emoji}</span>
          </div>
        </div>
      </div>

      <div className="divider my-0 py-0 h-1" />
    </>
  );
};
export default Conversation;
