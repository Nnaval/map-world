import React, { useEffect, useState } from "react";
import {
  Viewer,
  Cartesian3,
  Rectangle,
  Color,
  ColorMaterialProperty,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  Terrain,
  HeightReference,
  Ion,
  JulianDate,
  Model, // Import the Model class
  Cesium3DTileset,
  Transforms,
  Entity,
  PointGraphics,
  LabelStyle,
  VerticalOrigin,
  BoundingSphere,
  HeadingPitchRange,
  Math,
  HeadingPitchRoll,
  Cartesian2,
  DistanceDisplayCondition,
  HorizontalOrigin,
} from "cesium";

export const loadNewBuildingTileset = async (cesiumViewer) => {
  const seet = await Cesium3DTileset.fromIonAssetId(2593444);
  const stac = await Cesium3DTileset.fromIonAssetId(2593437);
  const anglican = await Cesium3DTileset.fromIonAssetId(2593439);
  const allSaint = await Cesium3DTileset.fromIonAssetId(2593442);
  const unit = await Cesium3DTileset.fromIonAssetId(2593443);
  const roundabout = await Cesium3DTileset.fromIonAssetId(2593447);
  const architecture = await Cesium3DTileset.fromIonAssetId(2533272);
  const stan = await Cesium3DTileset.fromIonAssetId(2533271);
  const senate = await Cesium3DTileset.fromIonAssetId(2593928);
  const fence1 = await Cesium3DTileset.fromIonAssetId(2593929);
  const fence2 = await Cesium3DTileset.fromIonAssetId(2593932);
  const unity = await Cesium3DTileset.fromIonAssetId(2868489);

  cesiumViewer.scene.primitives.add(seet);
  cesiumViewer.scene.primitives.add(seet);
  cesiumViewer.scene.primitives.add(stac);
  cesiumViewer.scene.primitives.add(anglican);
  cesiumViewer.scene.primitives.add(allSaint);
  cesiumViewer.scene.primitives.add(unit);
  cesiumViewer.scene.primitives.add(roundabout);
  cesiumViewer.scene.primitives.add(stan);
  cesiumViewer.scene.primitives.add(architecture);
  cesiumViewer.scene.primitives.add(senate);
  cesiumViewer.scene.primitives.add(fence1);
  cesiumViewer.scene.primitives.add(fence2);
  // cesiumViewer.scene.primitives.add(unity);
};

export const createTileWithProperties = (
  cesiumViewer,
  x,
  y,
  size,
  properties,
  color = Color.GREEN.withAlpha(0.3)
) => {
  return cesiumViewer.entities.add({
    position: Cartesian3.fromDegrees(x, y, 0),
    rectangle: {
      coordinates: Rectangle.fromDegrees(x, y, x + size, y + size),
      material: new ColorMaterialProperty(color),
      extrudedHeight: 0,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      outline: true,
      outlineColor: Color.BLACK,
      outlineWidth: 2.0,
    },
    properties: properties,
  });
};

export const callTHeCreateTIles = (cesiumViewer) => {
  const west = 6.984172042631101;
  const south = 5.357306567461418;
  const east = 7.024156834792838;
  const north = 5.413929176525564;

  const tileSize = 0.0007; // Adjusted size of each tile in degrees

  let tileID = 1;
  for (let lon = west; lon < east; lon += tileSize) {
    for (let lat = south; lat < north; lat += tileSize) {
      createTileWithProperties(cesiumViewer, lon, lat, tileSize, {
        tileId: tileID++,
        type: "tile",
        coordinates: { lon, lat, size: tileSize },
      });
    }
  }
};

export const trackLocation = (
  cesiumViewer,
  locationIcon,
  setLocationIcon,
  setLocation
) => {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const longt = position.coords.longitude;
        setLocation({
          longitude: longt,
          latitude: lat,
        });

        cesiumViewer.camera.flyTo({
          destination: Cartesian3.fromDegrees(longt, lat, 500),
          orientation: {
            heading: 0,
            pitch: -Math.PI / 2,
            roll: 0,
          },
        });

        if (locationIcon) {
          locationIcon.position = Cartesian3.fromDegrees(longt, lat);
        } else {
          const newRedDotEntity = new Entity({
            position: Cartesian3.fromDegrees(longt, lat),
            point: new PointGraphics({
              color: Color.RED,
              pixelSize: 20,
              heightReference: HeightReference.CLAMP_TO_GROUND,
            }),
          });
          cesiumViewer.entities.add(newRedDotEntity);
          setLocationIcon(newRedDotEntity);
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
      },
      {
        enableHighAccuracy: true, // Optional: enable high accuracy mode
        maximumAge: 0, // Optional: don't use cached position
        timeout: Infinity, // Optional: no timeout for getting location updates
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

export const load3DModel = async (cesiumViewer, shopName, lon, lat, tileId) => {
  const position = Cartesian3.fromDegrees(lon, lat);
  const modelMatrix = Transforms.eastNorthUpToFixedFrame(position);

  const model = await Model.fromGltfAsync({
    url: "/shops/food_shop.glb", // Replace with your shop model
    modelMatrix: modelMatrix,
    scale: 2,
  });

  // cesiumViewer.scene.primitives.add(model);

  // Add shop label
  cesiumViewer.entities.add({
    id: `tile-${tileId}`, // Unique ID for this tile
    name: `Tile ${tileId}`,
    position: position, // Use the same position as the model
    properties: {
      tileId: tileId, // Link this entity to the tile ID
      shopId: shopName, // Shop name or unique identifier
      coordinates: { lon, lat }, // Store coordinates for reference
    },
    model: {
      uri: "/shops/food_shop.glb", // Model file
      modelMatrix: modelMatrix,
      scale: 2,
    },
    label: {
      text: shopName, // Use the shop name from the mock data
      font: "18px sans-serif",
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      style: LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: VerticalOrigin.BOTTOM, // Move the label just above the model
      horizontalOrigin: HorizontalOrigin.CENTER, // Keep label centered horizontally
      eyeOffset: new Cartesian3(0.0, 0.0, -70.0), // Move the label in front of the model
      distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400.0), // Display label within a certain distance
    },
  });
};

export const load3DModelForShop = async (
  cesiumViewer,
  shopName,
  lon,
  lat,
  tileId,
  category
) => {
  if (isNaN(lon) || isNaN(lat)) {
    console.error(
      `Invalid coordinates for ${shopName}: longitude=${lon}, latitude=${lat}`
    );
    return;
  }

  // Define a mapping of categories to model URLs
  const categoryModelMap = {
    "Food & Beverage": "/shops/cane.glb",
    "Clothing & Accessories": "/shops/candy.glb",
    // "Electronics & Accessories": "/shops/elctronics.glb",
    // "Books & Stationery": "/shops/pizza.glb",
    default: "/shops/food_shop.glb", // Default model for undefined categories
  };

  // Get the model URL based on the category, falling back to the default
  const modelUrl = categoryModelMap[category] || categoryModelMap.default;

  // Get the position for the model
  const position = Cartesian3.fromDegrees(lon, lat);
  const modelMatrix = Transforms.eastNorthUpToFixedFrame(position);

  // Load the model asynchronously
  const model = await Model.fromGltfAsync({
    url: modelUrl, // Dynamic model URL based on the category
    modelMatrix: modelMatrix,
    scale: 2,
  });

  // Add the model to the scene (uncomment if you want primitives)
  // cesiumViewer.scene.primitives.add(model);

  // Create an entity for the tile, which includes both the model and the label
  const tileEntity = cesiumViewer.entities.add({
    id: `tile-${tileId}`, // Unique ID for this tile
    name: `Tile ${tileId}`,
    position: position, // Position of the model/tile
    properties: {
      type: "shop",
      tileId: tileId, // Link this entity to the tile ID
      shopId: shopName, // Shop name or unique identifier
      category: category, // Store category for reference
      coordinates: { lon, lat }, // Store coordinates for reference
    },
    model: {
      uri: modelUrl, // Dynamic model URL based on the category
      modelMatrix: modelMatrix,
      scale: 2,
    },
    label: {
      text: shopName, // The shop's name
      font: "18px sans-serif",
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 2,
      style: LabelStyle.FILL_AND_OUTLINE,
      verticalOrigin: VerticalOrigin.BOTTOM, // Position the label above the model
      horizontalOrigin: HorizontalOrigin.CENTER, // Center the label horizontally
      eyeOffset: new Cartesian3(0.0, 0.0, -70.0), // Move the label in front of the model
      distanceDisplayCondition: new DistanceDisplayCondition(0.0, 400.0), // Set display range
    },
  });

  console.log("Tile Entity Loaded:", tileEntity);
};

// Function to check if a tile is occupied based on longitude and latitude
export const checkIfTileOccupied = (tileId, shops) => {
  // console.log("tile Id gotten @ occupied tile checker", tileId);
  // console.log("shops gotten from occupied checker", shops);
  const occupiedTile = shops.find((shop) => {
    return shop.id == tileId;
  });

  console.log("Occupied Tile Object", occupiedTile);

  // If the tile is occupied, return an object with occupied status and the shop.user
  return occupiedTile
    ? { occupied: true, details: occupiedTile }
    : { occupied: false };
};

export const drawLineBetweenPoints = async (
  viewer,
  startLocation,
  endLocation
) => {
  const startPoint = Cartesian3.fromDegrees(
    startLocation.longitude,
    startLocation.latitude
  );
  const endPoint = Cartesian3.fromDegrees(
    endLocation.longitude,
    endLocation.latitude
  );
  const waypoints = await getMapboxDirections(
    startLocation.longitude,
    startLocation.latitude,
    endLocation.longitude,
    endLocation.latitude
  );

  if (waypoints && waypoints.length > 0) {
    // Draw the polyline following the road
    const positions = waypoints.map(([longitude, latitude]) =>
      Cartesian3.fromDegrees(longitude, latitude)
    );

    viewer.entities.add({
      polyline: {
        positions: positions,
        width: 3,
        material: Color.RED,
      },
    });

    // Fly to the destination (last waypoint)
    const [destinationLon, destinationLat] = waypoints[waypoints.length - 1];
    viewer.camera.flyToBoundingSphere(
      new BoundingSphere(
        Cartesian3.fromDegrees(destinationLon, destinationLat, 0),
        500
      ), // 500 meters offset
      {
        duration: 2,
        offset: new HeadingPitchRange(0, Math.toRadians(-30), 500),
      }
    );
  } else {
    viewer.entities.add({
      polyline: {
        positions: [startPoint, endPoint],
        width: 3,
        material: Color.RED,
      },
    });
  }
};

// function to log and see view orientations

export const flytoDestination = (viewer, lon, lat) => {
  // Fly to the bounding sphere at the specified longitude and latitude
  viewer.camera.flyToBoundingSphere(
    new BoundingSphere(Cartesian3.fromDegrees(lon, lat, 0), 500), // 500 meters offset from the object
    {
      duration: 2, // Fly duration in seconds
      offset: new HeadingPitchRange(0, Math.toRadians(-30), 500), // Adjust the range to maintain the object in the center
    }
  );

  // Add a 3D model entity that "hangs" in the air above the target location
  const pointerHeightOffset = 10; // Adjust the height above the 3D object (in meters)
  const position = Cartesian3.fromDegrees(lon, lat, pointerHeightOffset);

  // Define the model's rotation (Heading, Pitch, Roll)
  const heading = Math.toRadians(50); // Heading (rotation around the vertical axis)
  const pitch = Math.toRadians(0); // Pitch (tilt up/down)
  const roll = Math.toRadians(0); // Roll (rotation around the forward axis)
  const hpr = new HeadingPitchRoll(heading, pitch, roll);

  // Compute the quaternion for the orientation based on position
  const orientation = Transforms.headingPitchRollQuaternion(position, hpr);

  const pointerEntity = viewer.entities.add({
    position: Cartesian3.fromDegrees(lon, lat, pointerHeightOffset), // Add a height offset
    orientation: orientation, // Set the orientation
    model: {
      uri: "/models/pointer.glb", // Path or URL to your 3D model file
      scale: 1.0, // Scale the model if needed
      minimumPixelSize: 64, // Ensures the model is visible even at lower zoom levels
      maximumScale: 200, // Optional: to limit scaling at higher zoom
    },
  });

  // Optionally, zoom to the new entity
  viewer.zoomTo(pointerEntity);
};

export const userModelAdd = (viewer, long, lat) => {
  viewer.entities.add({
    position: Cartesian3.fromDegrees(longitude, latitude), // Initial position
    model: {
      uri: "path/to/your/model.glb", // URL to your .glb/.gltf model file
      minimumPixelSize: 64, // Ensures model is always visible at small scales
      maximumScale: 2000, // Adjust based on how large you want the model to appear
    },
  });
};

export const getMapboxDirections = async (
  startLon,
  startLat,
  endLon,
  endLat
) => {
  const accessToken =
    "pk.eyJ1IjoiZWF6eiIsImEiOiJjbTM5ZTVqeXUxMHJuMnBzY3Jpa3RpcjV6In0.4jWwsMi42zaIedqwlmVjXg";
  const profile = "walking"; // Options: driving, walking, cycling
  const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startLon},${startLat};${endLon},${endLat}?geometries=geojson&access_token=${accessToken}`;

  try {
    console.log("sending this url to mapbox", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log("got", data);

    if (data.code === "Ok") {
      return data.routes[0].geometry.coordinates; // Returns an array of [longitude, latitude] waypoints
    } else {
      console.error("Mapbox Directions request failed:", data.message);
    }
  } catch (error) {
    console.error("Error fetching directions:", error);
  }

  return null; // Return null if there's an error
};

export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInSeconds = globalThis.Math.floor((now - postDate) / 1000); // Explicitly use global Math

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = globalThis.Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = globalThis.Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = globalThis.Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // If more than a month ago, return the formatted date (e.g., 03 Nov)
  const options = { day: "2-digit", month: "short" };
  return new Intl.DateTimeFormat("en-US", options).format(postDate);
};
