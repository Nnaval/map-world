"use client";
import Image from "next/image";
import { AiOutlineArrowLeft, AiOutlineBell } from "react-icons/ai";
import { useParams } from "next/navigation";
import { fetchUserShopById } from "@lib/actions/shops.prisma";
import { useEffect, useState } from "react";
import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
import { useRouter } from "next/navigation";
import { FaCamera } from "react-icons/fa";
import { drawLineBetweenPoints } from "@constants/functions";
import { userLocation } from "@constants/userDat";

import { shopCategories } from "@constants/arrays";
// import StatusDrawer from "@components/drawers/StatusDrawer";
// import AddTextStatusDrawer from "@components/drawers/AddTextStatusDrawer";
// import AddMediaStatusDrawer from "@components/drawers/AddMediaStatusDrawer";
// import { useOnlineShops } from "@components/providers/OnlineShopsProvider";
// import { useToast } from "@components/hooks/use-toast";
import { useOnlineShops } from "@components/providers/OnlineShopsProvider";
import { CiLocationOn } from "react-icons/ci";
import StatusDrawer from "@components/drawers/StatusDrawer";
import AddTextStatusDrawer from "@components/drawers/AddTextStatusDrawer";
import { MdEdit } from "react-icons/md";
import AddMediaStatusDrawer from "@components/drawers/AddMediaStatusDrawer";

const ShopDynamicPage = ({ params }) => {
  const { id } = useParams();

  // Dummy Data
  const shopInfo = {
    name: "Name of Business",
    description: "Business Description",
    profileImage: "/assets/IceHomeImage1.jpg", // Replace with actual image
    orders: 13,
    products: [
      "/assets/IceHomeImage1.jpg",
      "/assets/pricelogo.png",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
    ],
  };
  const router = useRouter();
  const shopId = params.id.replace(/%20/g, " ");
  const [shop, setShop] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const { viewer, viewerReady, setMapVisible } = useCesiumViewer();
  const [wasNewImageUploaded, setWasNewImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [openTextStatusModal, setOpenTextStatusModal] = useState(false);
  const [loadingShop, setLoadingShop] = useState(true); // Initial loading state set to true
  const onlineShops = useOnlineShops();
  const isShopActive = onlineShops.some((shop) => shop.name === shopId);
  // const { toast } = useToast();

  useEffect(() => {
    const fetchUserShop = async () => {
      try {
        const fetchedShop = await fetchUserShopById(shopId);
        setShop(fetchedShop);
        setForm((prevForm) => ({
          ...prevForm,
          name: fetchedShop?.name || "",
          desc: fetchedShop?.description || "",
          image: fetchedShop?.image || "",
          category: fetchedShop?.category || "",
        }));
      } catch (error) {
        console.error("Error fetching shop:", error);
      } finally {
        setLoadingShop(false); // Set loading to false after fetching is complete
      }
    };
    fetchUserShop();
  }, [shopId]);

  const pushToRelativeMap = () => {
    setMapVisible(true);
    const shopLocation = {
      longitude: shop.longitude,
      latitude: shop.latitude,
    };
    drawLineBetweenPoints(viewer, userLocation, shopLocation);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredItems =
    searchTerm.trim() === ""
      ? shop?.shopItems
      : shop?.shopItems.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

  if (loadingShop) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading shop details...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Shop not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg--100 pb-14">
      <div className="relative bg-blue-500 text-white flex flex-col gap-3  items-center justify-center text-center h-[30vh] p-6 rounded-b-3xl pb-20">
        <div className="absolute top-4 left-4 text-2xl cursor-pointer">
          <AiOutlineArrowLeft />
        </div>
        <div
          className="absolute top-4 right-4 text-2xl cursor-pointer"
          onClick={pushToRelativeMap}
        >
          <CiLocationOn />
        </div>

        <h2 className="text-lg font-bold">{shopId}</h2>
        <p className="text-sm text-slate-200">{shop?.description}</p>

        <div
          className={`absolute  bottom-[-20px] ${
            shop?.statuses && shop.statuses.length > 0
              ? "border-4 border-green-400 rounded-full"
              : "border-white"
          }`}
        >
          <Image
            src={shop?.image || "/assets/IceHomeImage1.jpg"}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full w-24 h-24 border-4 "
            onClick={() => shop?.statuses.length > 0 && setShowDrawer(true)}
          />
          {isShopActive && (
            <div className="w-5 h-5 bg-green-500 border-2 border-black rounded-full absolute top-1 right-0"></div>
          )}
        </div>
      </div>

      {shop && (
        <StatusDrawer
          open={showDrawer}
          openChange={setShowDrawer}
          shopName={shop.name}
          image={shop.image}
          status={shop?.statuses}
        />
      )}

      <div className="mt-5 px-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600">Orders</p>
          <p className="font-bold">{shopInfo.orders} ➜</p>
        </div>
        <div className="flex justify-between items-center bg-white py-4 text-lg rounded-lg font-bold mt-4">
          <p className="">Products</p>
        </div>
      </div>
      {/* recent changes */}
      <div className="p-4">
        <div className="">
          {filteredItems.length !== 0 ? (
            filteredItems.products.map((product, index) => (
              <div className="grid grid-cols-4 gap-2">
                <div
                  key={index}
                  className="bg-slate-100 p-2 rounded shadow-sm h-24 relative"
                >
                  <Image
                    src={product}
                    alt="Product"
                    layout="fill" /* Makes the image take full width & height */
                    objectFit="cover" /* Ensures the image covers the entire space */
                    className="rounded"
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-700 text-lg">
              No Product Found
            </div>
          )}
        </div>
      </div>

      <MdEdit
        className="text-primary text-3xl fixed bottom-24 right-1"
        onClick={() => setOpenTextStatusModal(true)}
      />
      <AddTextStatusDrawer
        open={openTextStatusModal}
        openChange={setOpenTextStatusModal}
        shopId={shopId}
      />
      <label
        htmlFor="status-media"
        className=" fixed bottom-16 right-1 cursor-pointer"
      >
        <FaCamera
          className="text-primary text-3xl "
          // onClick={() => setOpenMediaStatusModal(true)}
        />
      </label>
      <AddMediaStatusDrawer shopId={shopId} />
    </div>
  );
};

export default ShopDynamicPage;
