import {
  addCommentToPost,
  fetchCommentsForPost,
} from "@lib/actions/posts.prisma";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { formatRelativeTime } from "@constants/functions";
import { FaRegHeart } from "react-icons/fa6";
import { DrawerContent } from "@components/ui/drawer";

const AddCommentToPostDrawer = ({ open, openChange, postId, authorId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState(""); // State to handle the reply input
  const [replyToCommentId, setReplyToCommentId] = useState(null); // Track the comment being replied to

  // Function to group comments into a nested structure based on parentId
  const groupCommentsByParent = (comments) => {
    const groupedComments = [];
    const map = new Map();

    // Add all comments to the map
    comments.forEach((comment) => {
      comment.replies = [];
      map.set(comment.id, comment);
    });

    // Create the nested structure
    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = map.get(comment.parentId);
        if (parent) {
          parent.replies.push(comment); // Add the comment to its parent's replies
        }
      } else {
        groupedComments.push(comment); // Top-level comments
      }
    });

    return groupedComments;
  };

  // Fetch comments for the selected post when the drawer opens
  useEffect(() => {
    if (postId) {
      const fetchComments = async () => {
        try {
          const fetchedComments = await fetchCommentsForPost(postId);
          const groupedComments = groupCommentsByParent(fetchedComments || []);
          setComments(groupedComments);
        } catch (error) {
          console.error("Error fetching comments:", error);
        }
      };
      fetchComments();
    }
  }, [postId]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      const commentResponse = await addCommentToPost({
        text: newComment,
        postId,
        authorId,
      });
      if (commentResponse.success) {
        setComments((prev) => [commentResponse.comment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (parentId) => {
    if (reply.trim() === "") return;

    try {
      const replyResponse = await addCommentToPost({
        text: reply,
        postId,
        authorId,
        parentId, // Pass parent comment ID to relate the reply
      });
      if (replyResponse.success) {
        // Update the state to include the new reply
        setComments((prev) => {
          const updatedComments = prev.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies
                  ? [...comment.replies, replyResponse.comment]
                  : [replyResponse.comment],
              };
            }
            return comment;
          });
          return updatedComments;
        });
        setReply("");
        setReplyToCommentId(null); // Reset the reply state
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Recursive function to render comments and their replies with indentation
  const renderComments = (comments, indentLevel = 0) => {
    return comments.map((comment) => (
      <div
        key={comment.id}
        className="mb-6"
        style={{ marginLeft: `${indentLevel * 20}px` }}
      >
        <div className="flex justify-between items-start mb-2">
          <Image
            src={comment.author.picture}
            alt={`${comment.author.name}'s profile`}
            className="w-10 h-10 rounded-full mr-3"
            width={100}
            height={100}
          />
          <div className="flex flex-col gap-1 w-full">
            <div className="flex gap-2 items-center">
              <div className="font-bold">{comment.author.name}</div>
              <div className="text-sm text-gray-400">
                @{comment.author.username}
              </div>
              <div className="text-sm text-gray-400">
                {formatRelativeTime(comment.createdAt)}
              </div>
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="text-sm w-[90%]">{comment.text}</div>
              <FaRegHeart className="text-gray-500" />
            </div>

            {/* Reply Input (only show if replying to this comment) */}
            {replyToCommentId === comment.id && (
              <div className="mt-2 flex gap-3">
                <input
                  type="text"
                  className="flex-1 p-2 border rounded-md bg-transparent"
                  placeholder="Write a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  className="bg-primary-500 text-white px-4 py-2 rounded-md"
                  onClick={() => handleAddReply(comment.id)}
                >
                  Reply
                </button>
              </div>
            )}

            {/* Reply Button */}
            <button
              className="text-sm text-primary-500 mt-2"
              onClick={() => setReplyToCommentId(comment.id)}
            >
              Reply
            </button>

            {/* Display Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-6 mt-4">
                {renderComments(comment.replies, indentLevel + 1)}{" "}
                {/* Recursively render replies */}
              </div>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (!open) return null;

  return (
    <Drawer open={open} onOpenChange={openChange}>
      <DrawerContent className="h-screen overflow-hidden p-4 bg-black text-white">
        <div className="flex items-center justify-center p-4">
          <h2 className="text-lg text-center font-bold">Comments</h2>
        </div>

        {/* Comments Section */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.length > 0 ? (
            renderComments(comments) // Render the comments with nested replies
          ) : (
            <p className="text-gray-500 text-center">No comments yet.</p>
          )}
        </div>

        {/* Input for Adding a New Comment */}
        <div className="p-4 flex items-center gap-3">
          <input
            type="text"
            className="flex-1 p-2 border rounded-md bg-transparent"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="bg-primary-500 text-white px-4 py-2 rounded-md"
            onClick={handleAddComment}
          >
            Post
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCommentToPostDrawer;
