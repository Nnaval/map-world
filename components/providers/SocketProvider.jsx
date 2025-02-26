"use client";
import socket from "@components/socket/Socket";
import {
  fetchUserShopById,
  fetchUserShopByUserId,
} from "@lib/actions/shops.prisma";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect } from "react";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  console.log("SocketProvider mounted");
  const { data: session } = useSession();
  const username = session?.user?.username;
  const userId = parseFloat(session?.user?.id);
  useEffect(() => {
    if (username && userId) {
      console.log("Emitting set_user_online with username:", username);
      socket.emit("set_user_online", { userId: userId, username: username });
    }
  }, [username, socket]);

  useEffect(() => {
    if (!userId || !username) return;

    const fetchShops = async () => {
      try {
        const shops = await fetchUserShopByUserId(userId);
        console.log("Fetched shops to be sent to socket server ", shops);
        if (shops?.length) {
          socket.emit("set_online_shops", { username, shops });
          console.log("set_shop has been emitted to sockets successfully");
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    };
    fetchShops();
  }, [userId, username, socket]);

  useEffect(() => {
    // Handle connection events globally
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      console.log("SocketProvider unmounted");
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
