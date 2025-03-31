import { searchUsers } from "@lib/actions/user.prisma";
import useGetConversations from "hooks/useGetConversations";
import { Search } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "zustand/useConversation";

const SearchInput = () => {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations, setConversations } = useGetConversations();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search term must be at least 3 characters long");
    }

    // Step 1: Try to find a conversation that matches the search
    const filteredConversations = conversations.filter((c) =>
      c?.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredConversations.length > 0) {
      setConversations(filteredConversations); // Update UI with filtered conversations
      return;
    }

    // Step 2: If no conversation is found, search for users in the database
    try {
      const filteredUsers = await searchUsers(search);

      if (filteredUsers > 0) {
        setConversations(filteredUsers); // Display users matching search
      } else {
        toast.error("No matching users found!");
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Something went wrong while searching.");
    }
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
      <button type="submit" className="text-sky-500">
        <Search className="text-lg font-bold" />
      </button>
    </form>
  );
};

export default SearchInput;
