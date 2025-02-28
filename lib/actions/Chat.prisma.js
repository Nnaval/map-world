"use server";

import prisma from "@prisma/prisma";

// import prisma from "@prisma/prisma";

export const getUsersForSidebar = async () => {
  try {
    // const authUserId = req.user.id;
    console.log("about to fetch all users for side bar");
    const users = await prisma.user.findMany({
      // where: {
      // 	id: {
      // 		not: authUserId,
      // 	},
      // },
      select: {
        id: true,
        name: true,
        picture: true,
      },
    });
    console.log("users were found", users);
    return users;
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error);
    // res.status(500).json({ error: "Internal server error" });
  }
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
