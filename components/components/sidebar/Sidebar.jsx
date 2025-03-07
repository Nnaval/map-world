// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

import useConversation from "zustand/useConversation";
import Conversations from "./Conversations";
import SearchInput from "./SearchInput";

const Sidebar = () => {
  const { setSelectedConversation, selectedConversation } = useConversation();

  return (
    <div
      className={`border-r border-slate-500 p-1 md:p-4 flex flex-col w-full lg:w-1/3 ${
        selectedConversation && "hidden md:flex"
      }`}
    >
      <SearchInput />
      {/* <div className="divider px-3" /> */}
      <Conversations />
      {/* <LogoutButton /> */}
    </div>
  );
};
export default Sidebar;
