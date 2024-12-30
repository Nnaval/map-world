"use client";

import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
import { useLocation } from "@components/providers/LocationProvider";
import FilterStores from "@components/ShopFilter";
import {
  drawLineBetweenPoints,
  flytoDestination,
  getMapboxDirections,
} from "@constants/functions";
import { userLocation } from "@constants/userDat";
import { fetchFilteredPlace } from "@lib/actions/places.prisma";
import { Cartesian3, Color } from "cesium";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaBookmark, FaLocationCrosshairs } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const MapFlyers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPlace, setFilteredPlace] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null); // Add debounce timer state
  const { viewer, viewerReady } = useCesiumViewer();
  const [locationError, setLocationError] = useState("");

  const { stableLocation, currentPosition, error } = useLocation();

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Clear the previous timeout if the user is still typing
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timeout to fetch shops after 2 seconds
    const newTimer = setTimeout(async () => {
      const results = await fetchFilteredPlace(term); // Fetch places
      setFilteredPlace(results); // Update the filtered place state
    }, 2000);

    // Save the new timer
    setDebounceTimer(newTimer);
  };

  const handleFly = async (long, lat) => {
    if (viewerReady) {
      flytoDestination(viewer, long, lat);
      if (error) {
        setLocationError(error);
        return;
      }
      const shopLocation = {
        longitude: long,
        latitude: lat,
      };
      const didget = await drawLineBetweenPoints(
        viewer,
        userLocation,
        shopLocation
      );
      console.log("places fetched", didget);
    }
  };

  const getRoute = async () => {
    const waypoints = await getMapboxDirections();
    console.log("route", waypoints);
    if (waypoints) {
      const positions = waypoints.map(([lng, lat]) =>
        Cartesian3.fromDegrees(lng, lat)
      );

      viewer.entities.add({
        polyline: {
          positions: positions,
          width: 5,
          material: Color.GREEN,
        },
      });
    }
  };

  const handleFlyBack = () => {
    flytoDestination(viewer, stableLocation.longitude, stableLocation.latitude);
  };

  return (
    <div className="absolute right-0 bg-dark-1 p-1 text-3xl text-light-1 z-20">
      {/* <FilterStores /> */}
      <div className="flex gap-2 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Location .."
            value={searchTerm}
            onChange={handleInputChange}
            className="text-black text-sm outline-none border rounded-lg p-1"
          />
          {/* Render results conditionally */}
          {filteredPlace.length > 0 && (
            <ul className="absolute text-sm bg-white text-black w-full mt-1 p-1 cursor-pointer">
              {filteredPlace.map((place, index) => (
                <li
                  key={index}
                  className="hover:bg-slate-300"
                  onClick={() => handleFly(place.longitude, place.latitude)}
                >
                  {place.placeName}{" "}
                  {/* Assuming the place object has a 'name' */}
                </li>
              ))}
            </ul>
          )}
          {locationError && (
            <p className="">
              Cannot give you directions at the moment because {locationError}
            </p>
          )}
        </div>
        <IoSearch />
        <FaHome />
        <FaBookmark onClick={() => getRoute()} />
      </div>
    </div>
  );
};

export default MapFlyers;
