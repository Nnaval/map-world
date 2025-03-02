import { extractTime } from "@constants/functions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useConversation from "zustand/useConversation";

const Message = ({ message }) => {
  const { data: session, status } = useSession();

  const { selectedConversation } = useConversation();

  const fromMe = message?.senderId == session?.user?.id;
  const img = fromMe ? session?.user.image : selectedConversation?.picture;
  const chatClass = fromMe ? "chat-end" : "chat-start";

  const bubbleBg = fromMe ? "bg-blue-500" : "";
  const shakeClass = "shake";
  //   console.log("message", message);
  return (
    <div
      className={`chat flex border w-full gap-2 ${chatClass} ${
        fromMe && "flex-row-reverse"
      }`}
    >
      <div className="hidden md:block chat-image avatar">
        <div className="w-6 md:w-10 rounded-full">
          <Image
            alt="profile"
            src={img || "https://randomuser.me/api/portraits/men/1.jpg"}
            width={20}
            height={20}
          />
        </div>
      </div>
      <div className="">
        <p
          className={`chat-bubble text-black ${bubbleBg} ${shakeClass} ${
            fromMe && "text-right"
          } text-sm md:text-md w-fit`}
        >
          {message.body}
        </p>
        <span
          className={`chat-footer opacity-50 text-xs flex gap-1 items-center ${
            fromMe && "justify-end"
          } text-black`}
        >
          {extractTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
export default Message;
