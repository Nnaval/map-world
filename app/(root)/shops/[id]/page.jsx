"use client";
import Image from "next/image";
import { AiOutlineArrowLeft, AiOutlineBell } from "react-icons/ai";
import { useParams } from "next/navigation";

const ShopDynamicPage = () => {
  const { id } = useParams();

  // Dummy Data
  const shopInfo = {
    name: "Name of Business",
    description: "Business Description",
    profileImage: "/assets/IceHomeImage1.jpg", // Replace with actual image
    orders: 13,
    products: [
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

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <div className="relative bg-blue-500 text-white text-center p-6 rounded-b-lg pb-20">
        <div className="absolute top-4 left-4 text-2xl cursor-pointer">
          <AiOutlineArrowLeft />
        </div>
        <div className="absolute top-4 right-4 text-2xl cursor-pointer">
          <AiOutlineBell />
        </div>

        <h2 className="text-lg font-bold">{shopInfo.name}</h2>
        <p className="text-sm">{shopInfo.description}</p>

        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-40px]">
          <Image
            src={shopInfo.profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-16 px-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600">Orders</p>
          <p className="font-bold">{shopInfo.orders} ➜</p>
        </div>
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mt-4">
          <p className="text-gray-600">Products</p>
          <p className="font-bold">➜</p>
        </div>
      </div>
      {/* recent changes */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {shopInfo.products.map((product, index) => (
            <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
              <Image
                src={product}
                alt="Product"
                width={80}
                height={80}
                className="rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDynamicPage;
