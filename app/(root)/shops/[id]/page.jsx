"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
// import StocksShopTab from "@components/shop/StocksShopTab";
// import OrdersShopTab from "@components/shop/OrdersShopTab";
import { FaCamera } from "react-icons/fa";
import {
  fetchUserShopById,
  updateShopDetails,
} from "@lib/actions/shops.prisma";
import Image from "next/image";
import Link from "next/link";
import { BsCart4 } from "react-icons/bs";
import { drawLineBetweenPoints } from "@constants/functions";
import { userLocation } from "@constants/userDat";
import { MdEdit } from "react-icons/md";
import Modal from "@components/modals/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";

import { shopCategories } from "@constants/arrays";
// import StatusDrawer from "@components/drawers/StatusDrawer";
// import AddTextStatusDrawer from "@components/drawers/AddTextStatusDrawer";
// import AddMediaStatusDrawer from "@components/drawers/AddMediaStatusDrawer";
import { useOnlineShops } from "@components/providers/OnlineShopsProvider";
import { useCesiumViewer } from "@components/providers/CesiumViewerProvider";
// import { useToast } from "@components/hooks/use-toast";
// import { useToast } from "@components/providers/hooks/use-toast";

const Shops = ({ params }) => {
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
    // setMapVisible(true);
    router.push("/map");
    const shopLocation = {
      longitude: shop.longitude,
      latitude: shop.latitude,
    };
    drawLineBetweenPoints(viewer, userLocation, shopLocation);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const [form, setForm] = useState({
    name: shop?.name || "",
    image: shop?.image || "",
    desc: shop?.description || "",
    category: "",
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event) => {
    setWasNewImageUploaded(true);
    console.log("wasNewImageUploaded", wasNewImageUploaded);
    console.error("file change triggerd");
    const file = event.target.files[0];
    console.log("Selected file:", file);

    // Check if the file is valid
    if (file && file instanceof Blob) {
      try {
        // Convert the file to base64 for preview
        const base64 = await convertToBase64(file);
        console.error("about to convert");

        setForm((prev) => ({ ...prev, image: base64 })); // Preview image immediately
        console.error("converted");
      } catch (uploadError) {
        console.error("Error while converting image to base64:", uploadError);
      }
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let updatedImageUrl = form.image; // Default to existing form image

      if (wasNewImageUploaded) {
        // Cloudinary upload
        const response = await fetch("/api/cloudinary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: form.image }),
        });
        const data = await response.json();

        if (!response.ok) {
          console.error("Image upload error:", data.error);
          return; // Exit if upload fails
        }

        // Update form with the Cloudinary URL
        updatedImageUrl = data.url;
        setForm((prev) => ({
          ...prev,
          image: updatedImageUrl,
        }));
      }

      // Save to the database with the Cloudinary URL
      const wasShopUpdated = await updateShopDetails(shopId, {
        name: form.name,
        image: updatedImageUrl, // Use updated Cloudinary URL here
        desc: form.desc,
        category: form.category,
      });
      setLoading(false);
      setShowEditModal(false);
      router.refresh();

      console.log("Shop updated:", wasShopUpdated);
    } catch (error) {
      console.error("Error updating shop:", error);
    }
  };

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
    <div className="">
      <div className="flex items-end gap-5 bg-primary text-white backdrop-blur-lg  p-5 rounded-t-lg">
        <div className="w-full">
          <div className="flex flex-col relative mb-1 gap-3 items-center">
            <div
              className={`w-14 h-14 relative rounded-full ${
                shop?.statuses && shop.statuses.length > 0
                  ? "border-4 border-green-400"
                  : ""
              }`}
            >
              <Image
                src={shop?.image || "/images/lorem.jpg"}
                alt="brand image"
                layout="fill"
                objectFit="cover"
                className="rounded-full w-14 h-14"
                onClick={() => setShowDrawer(true)}
              />
              {isShopActive && (
                <div className="w-5 h-5 bg-green-500 border-2 border-black rounded-full absolute top-1 right-0"></div>
              )}
            </div>
            <p className="font-bold">{shopId}</p>

            <div className="">
              <p className="text-center">{shop?.description}</p>
            </div>
            <MdEdit
              className="absolute top-7 right-0 text-white text-xl"
              onClick={() => setShowEditModal(true)}
            />
          </div>
          {/* {shop && (
            <StatusDrawer
              open={showDrawer}
              openChange={setShowDrawer}
              shopName={shop.name}
              image={shop.image}
              status={shop?.statuses}
            />
          )} */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="search item here...."
              className="w-full bg-dark-3 border border-slate-400-950 rounded px-2 py-1"
              value={searchTerm}
              // onChange={handleSearch}
            />
            {/* <button className="btn p-1 text-sm" onClick={pushToRelativeMap}>
              Map
            </button> */}
          </div>
        </div>
      </div>
      <Modal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        width="400px"
        height="fit"
      >
        <h6 className="text-xl font-semibold">Edit Your Store's Details</h6>
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex flex-col gap-3 py-4">
            <div className="rounded-full w-24 h-24 border   flex justify-center items-center cursor-pointer">
              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />

              {/* Camera icon button to trigger file input */}
              <label htmlFor="file-input" className="absolute cursor-pointer">
                <FaCamera className="text-3xl text-gray-600" />
              </label>

              {/* Display the selected image */}
              {form.image && (
                <Image
                  src={form.image}
                  alt="Profile_image"
                  width={100}
                  height={100}
                  className="rounded-full w-full h-full object-cover"
                />
              )}
            </div>
            <div className="">
              <label htmlFor="name" className="text-sm text-slate-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                placeholder="Enter your store name"
                className="bg-transparent w-full border-b outline-none text-sm"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div className="">
              <label htmlFor="description" className="text-sm text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief Description of what you do"
                value={form.desc}
                onChange={(e) => handleChange("desc", e.target.value)}
                className="bg-transparent w-full border p-[1px] rounded outline-none text-sm"
              />
            </div>
            <div className="">
              <label htmlFor="category" className="text-sm text-slate-700">
                Category
              </label>
              <Select
                value={form.category}
                onValueChange={(value) => handleChange("category", value)}
                className="w-full z-50"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="w-full z-50">
                  {shopCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            className="bg-primary-500 text-white p-1 rounded-lg px-4"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "saving.." : "Save"}
          </button>
        </div>
      </Modal>

      <div className="w-full">
        <Tabs defaultValue="Items">
          <TabsList className="sticky top-20 left-0 z-10 border-b bg-dark-1 w-full">
            <TabsTrigger value="Items" className="bg-dark-1">
              Items
            </TabsTrigger>
            <TabsTrigger value="Orders" className="bg-dark-1">
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Items">
            {/* <StocksShopTab
              shopId={shopId}
              shop={shop}
              searchTerm={searchTerm}
            /> */}
            Shop Items Appear here
          </TabsContent>

          <TabsContent value="Orders">
            Orders placed for shop appear here
            {/* <OrdersShopTab shop={shop} shopId={params.id} /> */}
          </TabsContent>
        </Tabs>
      </div>

      <Link
        href={"/shops/"}
        className="bg-primary-500 p-2 rounded fixed bottom-16 left-1"
      >
        <h6 className="text-sm">Cart</h6>
        <div className="flex gap-4">
          <BsCart4 className="text-2xl" />
        </div>
      </Link>

      <MdEdit
        className="text-white text-3xl fixed bottom-24 right-1"
        onClick={() => setOpenTextStatusModal(true)}
      />
      {/* <AddTextStatusDrawer
        open={openTextStatusModal}
        openChange={setOpenTextStatusModal}
        shopId={shopId}
      /> */}
      <label
        htmlFor="status-media"
        className=" fixed bottom-16 right-1 cursor-pointer"
      >
        <FaCamera
          className="text-white text-3xl "
          // onClick={() => setOpenMediaStatusModal(true)}
        />
      </label>
      {/* <AddMediaStatusDrawer shopId={shopId} /> */}
    </div>
  );
};

export default Shops;
