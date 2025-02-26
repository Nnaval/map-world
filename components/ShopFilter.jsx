"use client";

import { useState, useEffect } from "react";
import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
import { flytoDestination } from "@constants/functions";
import { FaSearch } from "react-icons/fa";
import { filterShops } from "@lib/actions/shops.prisma";
import { Cartesian3, Color, VerticalOrigin } from "cesium";

const FilterStores = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { viewer, setMapVisible } = useCesiumViewer();

  // Fetch all stores initially
  //   useEffect(() => {
  //     const fetchStores = async () => {
  //       const data = await getFilteredStores();
  //       setStores(data);
  //     };
  //     fetchStores();
  //   }, []);

  const handleFilter = async () => {
    const data = await filterShops(searchTerm, category);
    setFilteredStores(data);

    // Clear existing entities
    // viewer.entities.removeAll();

    // Add filtered stores to map
    data.forEach((store) => {
      viewer.entities.add({
        position: Cartesian3.fromDegrees(store.longitude, store.latitude),
        point: {
          pixelSize: 10,
          color: Color.RED, // Highlight filtered stores
        },
        label: {
          text: store.name,
          font: "14px sans-serif",
          fillColor: Color.WHITE,
          outlineWidth: 2,
          verticalOrigin: VerticalOrigin.BOTTOM,
        },
      });
    });

    // Fly to the first store, if any
    if (data.length > 0) {
      setMapVisible(true);
      flytoDestination(viewer, data[0].longitude, data[0].latitude);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search item"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          {/* Add more categories as needed */}
        </select>
        <button onClick={handleFilter} className="btn">
          <FaSearch /> Filter
        </button>
      </div>

      <div>
        {filteredStores.length > 0 ? (
          <ul>
            {filteredStores.map((store) => (
              <li key={store.id}>{store.name}</li>
            ))}
          </ul>
        ) : (
          <p>No stores match the criteria</p>
        )}
      </div>
    </div>
  );
};

export default FilterStores;
