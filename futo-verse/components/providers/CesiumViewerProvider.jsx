"use client";

// CesiumViewerContext.js
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import { Viewer, Terrain, Ion } from "cesium";

const CesiumViewerContext = createContext(null);

export const useCesiumViewer = () => useContext(CesiumViewerContext);

export const CesiumViewerProvider = ({ children }) => {
  const viewerRef = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);
  const [isMapVisible, setMapVisible] = useState(false); // Add map visibility state

  useEffect(() => {
    const initializeViewer = () => {
      try {
        const cesiumViewer = new Viewer("cesiumContainer", {
          // terrain: Terrain.fromWorldTerrain(),
          baseLayerPicker: false,
        });
        Ion.defaultAccessToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNGNkMDgyYy1jZWQ5LTRkZjktODc5NS01YmYwOWU2YjQ4ZmUiLCJpZCI6MjA1NDMyLCJpYXQiOjE3MTE3NzUxNTV9.2JgatZJRPURzsB8ZytMKxqfjvF53JCkLbbnj90x63_A";
        // terrainProvider = createWorldTerrainAsync();

        viewerRef.current = cesiumViewer;
        setViewerReady(true);
      } catch (error) {
        console.log("Error initialzing vesium", error);
      }
    };

    initializeViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  return (
    <CesiumViewerContext.Provider
      value={{
        viewer: viewerRef.current,
        viewerReady,
        isMapVisible,
        setMapVisible,
      }}
    >
      {children}
    </CesiumViewerContext.Provider>
  );
};
