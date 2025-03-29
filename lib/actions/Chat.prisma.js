"use server";

import prisma from "@prisma/prisma";

// import prisma from "@prisma/prisma";

export const getUsersForSidebar = async (authUserId) => {
  console.log("Fetching conversations for user:", authUserId);

  // Fetch conversations where the authenticated user is a participant
  const conversations = await prisma.conversation.findMany({
    where: {
      participantIds: {
        has: authUserId, // Ensure the authenticated user is a participant
      },
    },
    orderBy: {
      updatedAt: "desc", // Sort by latest activity
    },
    select: {
      id: true,
      updatedAt: true,
      messages: {
        orderBy: {
          createdAt: "desc", // Get the most recent message
        },
        take: 1,
        select: {
          body: true,
          createdAt: true,
          senderId: true,
          isRead: true,
        },
      },
      participantIds: true, // Get the participant IDs so we can filter out authUserId
    },
  });

  console.log(
    "Fetched raw conversations:",
    JSON.stringify(conversations, null, 2)
  );

  // Fetch receiver's details (excluding the authenticated user)
  const usersForSidebar = await Promise.all(
    conversations.map(async (conversation) => {
      const receiverId = conversation.participantIds.find(
        (id) => id !== authUserId
      );
      if (!receiverId) return null; // Edge case: If no receiver is found, skip

      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: {
          id: true,
          name: true,
          username: true,
          picture: true,
        },
      });

      return receiver
        ? {
            ...receiver,
            lastMessage: conversation.messages[0],
            conversationId: conversation.id,
          }
        : null;
    })
  );

  // Remove any null values (just in case)
  const filteredUsers = usersForSidebar.filter(Boolean);

  console.log(
    "Processed sidebar users:",
    JSON.stringify(filteredUsers, null, 2)
  );

  return filteredUsers;
};

export const getUserForConversation = async (id) => {
  try {
    // const authUserId = req.user.id;
    console.log("about to fetch all users for personal convo");
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        picture: true,
      },
    });
    console.log("user were found", user);
    return user;
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error);
    // res.status(500).json({ error: "Internal server error" });
  }
};
export const getMessagesOfUsers = async (receiverId, senderId) => {
  try {
    // Convert IDs to string
    const sender = parseFloat(senderId);

    const conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [sender, receiverId],
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!conversation) {
      console.log("participants have no data");
      return [];
    }

    console.log("participants have a created merger");
    return conversation.messages;
  } catch (error) {
    console.error("Error in getMessages: ", error);
    // Optionally rethrow or handle the error here
  }
};

export const sendMessageToUser = async ({ message, receiverId, senderId }) => {
  try {
    const sender = parseFloat(senderId);

    let conversation = await prisma.conversation.findFirst({
      where: {
        participantIds: {
          hasEvery: [sender, receiverId],
        },
      },
    });

    // the very first message is being sent, that's why we need to create a new conversation
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantIds: {
            set: [sender, receiverId],
          },
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: sender,
        body: message,
        conversationId: conversation.id,
      },
    });

    if (newMessage) {
      conversation = await prisma.conversation.update({
        where: {
          id: conversation.id,
        },
        data: {
          messages: {
            connect: {
              id: newMessage.id,
            },
          },
        },
      });
      console.log("new message was sent", newMessage);
    }

    // Socket io will go here
    // const receiverSocketId = getReceiverSocketId(receiverId);

    // if (receiverSocketId) {
    // 	io.to(receiverSocketId).emit("newMessage", newMessage);
    // }

    // res.status(201).json(newMessage);
    return newMessage;
  } catch (error) {
    console.error("Error in sendMessage: ", error);
    // res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (conversationId, authUserId) => {
  console.log("Marking messages as read for conversation:", conversationId);

  // Update unread messages where the receiver is NOT the sender
  const updatedMessages = await prisma.message.updateMany({
    where: {
      conversationId: conversationId,
      senderId: { not: authUserId }, // Ensure we are marking messages from the other user
      isRead: false, // Only update unread messages
    },
    data: {
      isRead: true,
    },
  });

  console.log("Updated messages:", updatedMessages);
  return updatedMessages;
};
