"use client";

import React, { useEffect, useState } from "react";
import {
  Viewer,
  Cartesian3,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  Terrain,
  Color,
  ColorMaterialProperty,
  JulianDate,
  Ion,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

import {
  callTHeCreateTIles,
  checkIfTileOccupied,
  drawLineBetweenPoints,
  flytoDestination,
  load3DModelForShop,
  loadNewBuildingTileset,
} from "@constants/functions";
import OccupiedTile from "@components/modals/OccupiedTileModal";
import TileModal from "../modals/UnOccupiedTileModal";
import { useCesiumViewer } from "../providers/CesiumViewerProvider";
import { motion } from "framer-motion";
import { IoMdArrowBack } from "react-icons/io";
import OccupiedTile from "../modals/OccupiedTileModal";
import { fetchOnlyShops } from "@/lib/actions/shops.prisma";
// import { fetchOnlyShops } from "@lib/actions/shops.prisma";
import MapFlyers from "@components/Navigation/MapFlyers";
import MapNav from "@components/Navigation/MapNav";
import { useLocation } from "@components/providers/LocationProvider";
import { useSession } from "next-auth/react";
import UserInfoModal from "@components/modals/UserInfoModal";

const CesiumMapB = () => {
  const { viewer, viewerReady, isMapVisible, setMapVisible } =
    useCesiumViewer();
  const [selectedTile, setSelectedTile] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [showUserModal, setShowUserModal] = useState(false); // Modal visibility state
  const [tileInfo, setTileInfo] = useState({}); // Store tile data (longitude, latitude, ID)
  const [userInfo, setUserInfo] = useState({}); // Store tile data (longitude, latitude, ID)
  const [occupiedTileDetails, setOccupiedTileDetails] = useState({});

  const [isOccupied, setIsOccupied] = useState(false); // State to check tile status
  const [activeTile, setActiveTile] = useState(null); // State to keep track of the active tile

  const [shops, setShops] = useState([]);
  // const [userEntity, setUserEntity] = useState(null);
  let userEntity = null; // Reference for the user entity

  const { stableLocation, currentPosition, error } = useLocation();
  const { data: session } = useSession();

  useEffect(() => {
    const initializeCesium = async () => {
      Ion.defaultAccessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNGNkMDgyYy1jZWQ5LTRkZjktODc5NS01YmYwOWU2YjQ4ZmUiLCJpZCI6MjA1NDMyLCJpYXQiOjE3MTE3NzUxNTV9.2JgatZJRPURzsB8ZytMKxqfjvF53JCkLbbnj90x63_A";
      // terrainProvider = createWorldTerrainAsync();
      if (viewerReady && viewer) {
        loadNewBuildingTileset(viewer);

        viewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(
            6.987165014949664,
            5.394837089099982,
            500
          ),
          orientation: {
            heading: 0,
            pitch: -Math.PI / 3,
            roll: 0,
          },
        });

        callTHeCreateTIles(viewer);

        const loadAllRealShops = async () => {
          const load = await fetchOnlyShops();
          // Load 3D models and labels for each shop
          load.shops.forEach((shop) => {
            const { name, longitude, latitude, size, id, category } = shop;
            const longCenter = longitude;
            +size / 2;
            const latCenter = latitude;
            +size / 2;
            load3DModelForShop(
              viewer,
              name,
              longCenter,
              latCenter,
              id,
              category
            );
          });
          setShops(load.shops);
        };
        await loadAllRealShops();

        const handleTileClick = async (tile) => {
          const load = await fetchOnlyShops();
          const tileOccupied = checkIfTileOccupied(
            tile.properties.tileId,
            load.shops
          );
          console.log("Ocuppation", tileOccupied);

          setIsOccupied(tileOccupied.occupied);

          setActiveTile(tile);

          setOccupiedTileDetails(
            tileOccupied.details // Add shop owner (user) if occupied
          );
          setShowModal(true); // Open modal when tile is clicked
        };
        const handleUserClick = () => {
          console.log("handleUserClick called");
          // setShowModal(true); // Open modal when tile is clicked
          setShowUserModal(true);
        };

        // Click handler for picking tiles
        const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction((movement) => {
          const pickedObject = viewer.scene.pick(movement.position);
          console.log("Picked Object full:", { pickedObject });
          if (defined(pickedObject) && defined(pickedObject.id)) {
            const properties = pickedObject.id.properties.getValue(
              JulianDate.now()
            );

            // Log picked object properties
            console.log("Picked Object:", { properties });
            console.log("properties", properties.id);

            const tileCenterLon =
              properties.coordinates.lon + properties.coordinates.size / 2;
            const tileCenterLat =
              properties.coordinates.lat + properties.coordinates.size / 2;

            if (properties.type === "tile") {
              handleTileClick(pickedObject.id);
              console.log("selscted tile value", selectedTile);

              if (selectedTile) {
                selectedTile.rectangle.material = new ColorMaterialProperty(
                  Color.GREEN.withAlpha(0.3)
                );
                console.log("there is a selscted tile o", selectedTile);
              } else {
                console.log("nothing like selscted tile o");
                pickedObject.id.rectangle.material = new ColorMaterialProperty(
                  Color.BLUE.withAlpha(1)
                );
              }

              setSelectedTile(pickedObject.id);

              // Set tile data and open modal
              setTileInfo({
                longitude: tileCenterLon,
                latitude: tileCenterLat,
                size: properties.size,
                id: properties.tileId,
                occupiedDetails: occupiedTileDetails,
              });
              setShowModal(true);
            }
            if (properties.type === "shop") {
              handleTileClick(pickedObject.id);
              // Set tile data and open modal
              setTileInfo({
                longitude: tileCenterLon,
                latitude: tileCenterLat,
                size: properties.size,
                id: properties.tileId,
                occupiedDetails: occupiedTileDetails,
              });
              setShowModal(true);
            }
            if (properties.type === "user") {
              handleUserClick();
              console.log("its a user entity");
              setUserInfo({
                username: properties.username,
              });
              setShowUserModal(true);
              console.log("show modal state =", showUserModal);
            }
          }
        }, ScreenSpaceEventType.LEFT_CLICK);
      }
    };

    initializeCesium();
  }, [viewer]);

  useEffect(() => {
    if (viewer && currentPosition && session) {
      const username = session?.user.username;

      const { longitude, latitude } = currentPosition;
      const position = Cartesian3.fromDegrees(longitude, latitude);

      // Check if the entity already exists
      const existingEntity = viewer.entities.getById(`user-${username}`);

      if (existingEntity) {
        // Update the position of the existing entity
        existingEntity.position = position;
      } else {
        // Add a new entity if it doesn't exist
        viewer.entities.add({
          id: `user-${username}`, // Unique ID for this entity
          name: `user ${username}`,
          position: position, // Position of the model/tile
          properties: {
            username: username, // Link this entity to the username
            type: "user",
            coordinates: { longitude, latitude }, // Store coordinates for reference
          },
          point: {
            pixelSize: 10, // Example: make the red dot a visible point
            color: Color.RED,
          },
        });
      }
    }
  }, [currentPosition, session]);

  return (
    <>
      <motion.div
        className="cesium-map-container"
        initial={{ opacity: 0, y: 100, zIndex: 1 }} // Start hidden and beneath
        animate={
          isMapVisible
            ? { opacity: 1, y: 0, zIndex: 10 }
            : { opacity: 0, y: 100, zIndex: 1 }
        } // Bring map on top and animate in
        transition={{ duration: 1, ease: "easeInOut" }} // Adjust timing as needed
        style={{ pointerEvents: isMapVisible ? "auto" : "none" }} // Disable pointer events when hidden
      >
        <div
          id="cesiumContainer"
          className="w-full h-[120vh] overflow-y-hidden relative border "
        >
          {/* search/other basr */}
          <MapFlyers />
          <div
            className="absolute z-20  top-5 left-5"
            onClick={() => setMapVisible(false)}
          >
            <IoMdArrowBack className="text-white bg-dark-1 text-3xl rounded-full p-2" />
            <p className="text-white text-[10px]"></p>
          </div>

          <MapNav />
        </div>

        {/* Modal to display selected tile info */}

        {showUserModal && (
          <UserInfoModal
            showModal={showUserModal}
            setShowModal={setShowUserModal}
            userInfo={userInfo}
          />
        )}

        {showModal && (
          <>
            {isOccupied ? (
              <OccupiedTile
                showModal={showModal}
                setShowModal={setShowModal}
                tileInfo={tileInfo}
                tileDetails={occupiedTileDetails}
              />
            ) : (
              <TileModal
                showModal={showModal}
                setShowModal={setShowModal}
                tileInfo={tileInfo}
              />
            )}
          </>
        )}
      </motion.div>
    </>
  );
};

export default CesiumMapB;
