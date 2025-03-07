import useGetConversations from "hooks/useGetConversations";
import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "zustand/useConversation";
// import useConversation from "../../zustand/useConversation";
// import useGetConversations from "../../hooks/useGetConversations";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    const conversation = conversations.find((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch("");
    } else toast.error("No such user found!");
  };

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search…"
        className="w-full border rounded-full p-2 px-3 outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className=" text-sky-500   ">
        <Search className="text-lg font-bold" />
      </button>
    </form>
  );
};
export default SearchInput;
