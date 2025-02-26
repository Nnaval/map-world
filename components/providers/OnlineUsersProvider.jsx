"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";

const OnlineUsersContext = createContext([]);

export const OnlineUsersProvider = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState({});
  const socket = useSocket();

  useEffect(() => {
    const handleOnlineUsersUpdate = (users) => {
      setOnlineUsers(users);
      console.log("online users =", onlineUsers);
    };

    socket.on("update_online_user", handleOnlineUsersUpdate);

    return () => {
      socket.off("update_online_user", handleOnlineUsersUpdate);
    };
  }, [socket]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => useContext(OnlineUsersContext);
