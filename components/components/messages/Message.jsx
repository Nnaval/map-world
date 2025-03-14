import { extractTime } from "@constants/functions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import useConversation from "zustand/useConversation";

const Message = ({ message }) => {
  const { data: session, status } = useSession();
  const { selectedConversation } = useConversation();

  const fromMe = message?.senderId == session?.user?.id;
  const img = fromMe ? session?.user.image : selectedConversation?.picture;
  const bubbleBg = fromMe ? "bg-primary" : "bg-slate-200 ";
  const shakeClass = "shake";

  return (
    <div className={`flex w-full gap-2 ${fromMe && "flex-row-reverse"}`}>
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
      <div
        className={`flex flex-col max-w-[70%] md:max-w-[50%] ${
          fromMe ? "items-end" : "items-start"
        }`}
      >
        <p
          className={`rounded-xl px-3 py-2 ${bubbleBg} ${shakeClass} ${
            fromMe ? "text-white" : "text-black"
          } text-sm md:text-md w-fit  leading-tight break-words`}
        >
          {message.body}
        </p>

        <span
          className={`opacity-50 text-xs flex gap-1 items-center ${
            fromMe ? "justify-end" : "justify-start"
          } text-black`}
        >
          {extractTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default Message;
