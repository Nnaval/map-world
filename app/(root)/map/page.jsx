"use client";

import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
import React, { useEffect, useState } from "react";

const Mqp = () => {
  const { viewerReady, setMapVisible } = useCesiumViewer();
  const [mapLoadingMessage, setMapLoadingMessage] = useState("");

  useEffect(() => {
    if (viewerReady) {
      setMapVisible(true);
    } else {
      setMapLoadingMessage(
        "Map is not yet ready, please wait. Here you can display a loading spinner or an option to use the 2D map."
      );
    }

    // No return value here since no cleanup is necessary
  }, [viewerReady, setMapVisible]);

  return (
    <div>
      {!viewerReady && (
        <p className="font-bold text-3xl">{mapLoadingMessage}</p>
      )}
    </div>
  );
};

export default Mqp;
