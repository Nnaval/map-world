// import { useAuthContext } from "../../context/AuthContext";
// import useConversation from "../../zustand/useConversation";
import useConversation from "zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

import { MessageCircle } from "lucide-react";
import { BsBack } from "react-icons/bs";
import { IoMdArrowBack } from "react-icons/io";
import Image from "next/image";

const MessageContainer = () => {
  const { setSelectedConversation, selectedConversation } = useConversation();

  return (
    <div
      className={`w-full flex flex-col ${
        !selectedConversation && "hidden md:flex"
      }`}
    >
      {!selectedConversation ? (
        <>
          <NoChatSelected />
        </>
      ) : (
        <>
          {/* Header */}
          <div className="bg-slate-500 px-4 py-2 mb-2 flex gap-3 items-center z-40">
            <IoMdArrowBack
              className="text-lg"
              onClick={() => setSelectedConversation(null)}
            />
            <div className="w-10 h-10 border rounded-full">
              <Image
                alt="profile"
                src={
                  selectedConversation.picture ||
                  "https://randomuser.me/api/portraits/men/1.jpg"
                }
                width={20}
                height={20}
                className="w-10 h-10  rounded-full"
              />
            </div>
            <span className="text-gray-900 font-bold">
              {selectedConversation.name}
            </span>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  // const { authUser } = useAuthContext();
  const authUser = {
    id: "12345",
    fullName: "okeke emmanuel ",
    email: "eokeke320@gamil.com",
    profilePic:
      "https://res.cloudinary.com/daueleyul/image/upload/v1740496632/your_folder_name/se6k3cjuvmmfjsqysvwt.jpg",
    gender: "male",
  };
  return (
    <div className="md:flex items-center justify-center w-full h-full hidden">
      <div className="px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser?.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <MessageCircle className="text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
