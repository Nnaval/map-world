import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
import { Cartesian3 } from "cesium";
import React, { useEffect, useState } from "react";

const LocationTracker = () => {
  const { viewer, viewerReady } = useCesiumViewer();
  const [userEntity, setUserEntity] = useState(null);

  useEffect(() => {
    if (viewerReady && viewer) {
      // Start tracking user's location
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { longitude, latitude } = position.coords;

          if (!userEntity) {
            // Add a new entity (model) for the user if it doesn't exist
            const newUserEntity = viewer.entities.add({
              name: "User Model",
              position: Cartesian3.fromDegrees(longitude, latitude, 0), // Ground level (elevation 0)
              model: {
                uri: "/3d/girlwalk.glb", // Path to the user's model (GLB or glTF)
                scale: 1.0, // Adjust scale if necessary
                minimumPixelSize: 64, // Minimum size of the model on the screen
              },
            });
            setUserEntity(newUserEntity); // Save the entity to state
          } else {
            // Update the user's model position if the entity already exists
            userEntity.position = Cartesian3.fromDegrees(
              longitude,
              latitude,
              0
            );
          }

          // Fly the camera to the new user position
          viewer.camera.flyTo({
            destination: Cartesian3.fromDegrees(longitude, latitude, 100),
          });
        },
        (error) => {
          console.log("Geolocation error", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 } // Geolocation options
      );

      // Cleanup: Stop tracking the location when the component is unmounted
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [viewerReady, viewer, userEntity]); // Dependency array ensures this runs when viewer is ready

  return <div></div>;
};

export default LocationTracker;
