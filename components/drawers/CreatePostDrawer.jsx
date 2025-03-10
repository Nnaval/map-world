import React, { useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import Image from "next/image";
import { IoIosSend } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai"; // For closing the image
import { createStoreStatus } from "@lib/actions/status.prisma";
import { createPost } from "@lib/actions/posts.prisma";
import { useSession } from "next-auth/react";

const CreatePostDrawer = ({ open, openChange, shopId }) => {
  const [media, setMedia] = useState(null); // Track media input
  const [text, setText] = useState(""); // Track text input
  const [error, setError] = useState(""); // Track file validation errors
  const maxLength = 280; // Adjusted max characters for a more Twitter-like feel
  const { data: session } = useSession();

  // Handle text input change
  const handleTextChange = (e) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
    }
  };

  // Handle file input change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    // Validate file
    if (file && file.type.startsWith("image/")) {
      try {
        const base64 = await convertToBase64(file);
        setMedia(base64);
        setError(""); // Clear any previous errors
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    } else {
      setError("Please select a valid image file");
    }
  };

  // Utility function to convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle status submission
  //   useEffect(() => {

  //   }, [session]);
  const handleSubmit = async () => {
    if (!text.trim() && !media) {
      alert("Post must include text or media!");
      return;
    }

    try {
      const form = { text, media };
      if (session) {
        const authorId = session.user.username;
        const postedStatus = await createPost(authorId, form);
        console.log("Post created successfully:", postedStatus);

        // Clear inputs and close the drawer
        setText("");
        setMedia(null);
        openChange(false);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Drawer open={open} onOpenChange={openChange}>
      <DrawerContent className="h-screen overflow-hidden p-4 bg-black text-white">
        {/* Post Preview */}
        <div className="flex flex-col items-start mb-4">
          <div className="w-full flex items-start gap-3">
            {/* Media Preview */}

            {/* Real-time Text Display */}
            <div className="flex-1">
              <textarea
                value={text}
                onChange={handleTextChange}
                className="w-full bg-transparent border-none resize-none outline-none text-lg"
                placeholder="What's happening?"
                rows={7}
                maxLength={maxLength}
              ></textarea>
            </div>
          </div>
          {/* Character Counter */}
          <p
            className={`text-sm ${
              text.length === maxLength ? "text-red-500" : "text-gray-400"
            }`}
          >
            {text.length}/{maxLength}
          </p>
        </div>
        {media && (
          <div className="relative w-24 h-24 border rounded">
            <Image
              src={media}
              alt="post-media"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
            <button
              onClick={() => setMedia(null)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1"
            >
              <AiOutlineClose />
            </button>
          </div>
        )}
        {/* Add Image Button */}
        <div className="my-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="post-media"
          />
          <label
            htmlFor="post-media"
            className="cursor-pointer text-primary-500 hover:underline"
          >
            {media ? "Change Image" : "Add Image"}
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Post Button */}
        <div className="fixed bottom-4 left-0 w-full px-4">
          <button
            onClick={handleSubmit}
            className="w-full bg-primary-500 text-white rounded-full py-2 text-lg font-semibold"
          >
            Post
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreatePostDrawer;
