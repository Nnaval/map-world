"use client";
import { useOnlineShops } from "@components/providers/OnlineShopsProvider";
import { fetchAllShops, filterShops } from "@lib/actions/shops.prisma";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Shops = () => {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [debounceTimer, setDebounceTimer] = useState(null); // State to hold the debounce timer

  // Function to fetch all shops or search based on the term
  const fetchShops = async (term = "") => {
    if (term) {
      // If there is a search term, fetch filtered shops
      const filteredShops = await filterShops(term); // Fetch shops based on the search term
      setShops(filteredShops);
    } else {
      // If no search term, fetch all shops
      const allShops = await fetchAllShops();
      setShops(allShops);
    }
  };

  // Fetch all shops on component load
  useEffect(() => {
    fetchShops(); // Initially fetch all shops
  }, []);

  // Handle input change with 2-second debouncing
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Clear the previous timeout if the user is still typing
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timeout to fetch shops after 2 seconds
    const newTimer = setTimeout(() => {
      fetchShops(term); // Fetch shops after 2 seconds
    }, 2000);

    // Save the new timer
    setDebounceTimer(newTimer);
  };

  return (
    <div>
      <div className="flex items-end gap-5 bg-[#d48133] backdrop-blur-lg px-10 py-5 rounded-t-lg">
        <div className="w-full">
          <p className="text-amber-950 font-bold">
            A better heading here right ?
          </p>
          <input
            type="text"
            value={searchTerm} // Bind the search input to state
            onChange={handleInputChange} // Update state on input change and trigger search after debounce
            placeholder="Enter shop name or item...."
            className="w-full bg-amber-950 rounded px-2 py-1"
          />
        </div>
      </div>
      <div className="flex flex-col p.-14 py-2  rounded-b-lg h-[65v] overflow-y-scrol">
        {shops.map((shop) => (
          <div
            className="flex flex-col py-2 bg-slate-200 mb-4 p-4 rounded-lg"
            key={shop.name}
          >
            <div className="flex gap-3 items-center">
              <div className="w-14 h-14 relative rounded">
                <Image
                  src={
                    shop?.image ||
                    "https://randomuser.me/api/portraits/men/1.jpg"
                  }
                  alt="brand image"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="text-[#d48133]">{shop.name}</p>
                <p>{shop.description}</p>
                <p className="text-black">
                  Category: <span className="text-black">{shop.category}</span>
                </p>
              </div>
            </div>

            {/* Check if shopItems were matched */}
            {shop.shopItems?.length > 0 && (
              <div className="mt-2">
                <p className="font-bold">Matched Items:</p>
                <ul className="list-disc list-inside">
                  {shop.shopItems
                    .filter(
                      (item) =>
                        item.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) // Filter items by matching the search term
                    )
                    .map((matchedItem) => (
                      <li key={matchedItem.id}>{matchedItem.name}</li> // Render only the matched items
                    ))}
                </ul>
              </div>
            )}

            <Link
              href={`/shops/${shop.name}`}
              className="bg-primary w-fit rounded-xl p-1 mt-3"
            >
              Visit Shop
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shops;
