import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
import { useLocation } from "@components/providers/LocationProvider";
import { useSocket } from "@components/providers/SocketProvider";
import { Cartesian3, Color, Transforms } from "cesium";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef } from "react";

export const AddUserMarkerToMap = () => {
  const socket = useSocket();
  const { currentPosition } = useLocation();
  const { data: session } = useSession();
  const { viewer } = useCesiumViewer();
  const lastSentLocation = useRef(null);
  const markerIdRef = useRef(null);

  useEffect(() => {
    if (viewer && currentPosition && session) {
      const { longitude, latitude } = currentPosition;
      const username = session?.user.username;

      // Throttle location updates
      const currentLocationString = `${longitude}-${latitude}`;
      if (lastSentLocation.current === currentLocationString) return;
      lastSentLocation.current = currentLocationString;

      // Fallback to username-based ID if socket.id is not available
      const fallbackId = `user-${username}`;
      const socketBasedId = socket.id ? `user-${socket.id}` : fallbackId;
      markerIdRef.current = socketBasedId;

      const position = Cartesian3.fromDegrees(longitude, latitude);
      const modelMatrix = Transforms.eastNorthUpToFixedFrame(position);

      // Check if the user's marker already exists and update its position
      const existingEntity = viewer.entities.getById(markerIdRef.current);
      if (existingEntity) {
        existingEntity.position = position;
      } else {
        viewer.entities.add({
          id: markerIdRef.current,
          name: `User: ${username}`,
          position: position,
          properties: {
            username: username,
            type: "user",
            coordinates: { longitude, latitude },
          },
          model: {
            uri: "/models/walk.glb", // Model file
            modelMatrix: modelMatrix,
            scale: 10,
          },
          point: { pixelSize: 20, color: Color.RED },
        });
      }

      // Emit location to the server for other users
      if (socket.connected) {
        socket.emit("update_location", {
          socketId: socket.id,
          username,
          latitude,
          longitude,
        });
      } else {
        console.log(
          "My location updates wasnt sent because socket is not connected "
        );
      }
    }
  }, [currentPosition, session, viewer]);

  // Update marker ID when socket.id becomes available
  useEffect(() => {
    if (
      socket.id &&
      markerIdRef.current &&
      markerIdRef.current !== `user-${socket.id}`
    ) {
      const oldMarkerId = markerIdRef.current;
      const newMarkerId = `user-${socket.id}`;
      markerIdRef.current = newMarkerId;

      // Update the entity's ID in Cesium
      const existingEntity = viewer.entities.getById(oldMarkerId);
      if (existingEntity) {
        console.log("we wanted to change to entity id , but it wasnt possible");
        // existingEntity.id = newMarkerId;
      }
    }
  }, [socket.id, viewer]);

  return null;
};

export const DisplayAllUserMarkers = () => {
  const { viewer, viewerReady } = useCesiumViewer();
  const { data: session } = useSession();
  const userEntitiesRef = useRef({});
  const socket = useSocket();

  useEffect(() => {
    const handleUpdateEntities = (data) => {
      console.log("connected clients =", data);
      console.log("useRef =", userEntitiesRef);
      userEntitiesRef.current = data;

      if (viewer && viewerReady) {
        Object.entries(data).forEach(
          ([socketId, { username, latitude, longitude }]) => {
            // Skip the current user's marker
            if (username === session?.user.username) return;
            // if (socketId === socket.id) return;
            const position = Cartesian3.fromDegrees(longitude, latitude);
            const modelMatrix = Transforms.eastNorthUpToFixedFrame(position);
            const existingEntity = viewer.entities.getById(`user-${socketId}`);
            if (existingEntity) {
              existingEntity.position = position;
            } else {
              viewer.entities.add({
                id: `user-${socketId}`, // Use socket ID as the unique identifier
                name: `User: ${username}`,
                position: position,
                properties: {
                  username,
                  type: "user",
                  coordinates: { longitude, latitude },
                },
                point: { pixelSize: 30, color: Color.BLUE },
                model: {
                  uri: "/models/walk.glb", // Model file
                  modelMatrix: modelMatrix,
                  scale: 5,
                },
              });
            }
          }
        );

        // Remove markers for disconnected users (except current user)
        viewer.entities.values.forEach((entity) => {
          if (
            entity.properties &&
            entity.properties.type === "user" &&
            entity.properties.username !== session?.user.username &&
            !Object.keys(userEntitiesRef.current).includes(
              entity.id.split("user-")[1]
            )
          ) {
            viewer.entities.remove(entity);
          }
        });
      }
    };

    socket.on("update_entities", handleUpdateEntities);
    return () => socket.off("update_entities", handleUpdateEntities);
  }, [viewer, viewerReady, session, socket]);

  return null;
};
