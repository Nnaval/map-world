"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft, AiOutlineBell } from "react-icons/ai";
import { FiChevronRight } from "react-icons/fi";

const Shops = ({ business = {}, orders = 0, products = [] }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="relative bg-blue-500 text-white p-6 rounded-b-3xl">
        <div className="flex justify-between items-center">
          <AiOutlineArrowLeft
            className="text-2xl cursor-pointer"
            onClick={() => router.back()}
          />
          <AiOutlineBell className="text-2xl cursor-pointer" />
        </div>
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">
            {business.name || "Business Name"}
          </h2>
          <p className="text-sm opacity-80">
            {business.description || "Business Description"}
          </p>
        </div>
        {business.image && (
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-40px]">
            <Image
              src={business.image}
              alt="Profile Picture"
              width={80}
              height={80}
              className="rounded-full border-4 border-white"
            />
          </div>
        )}
      </div>

      {/* Orders & Products Section */}
      <div className="mt-12 px-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-4">
          <span className="text-gray-700 font-medium">Orders</span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700 font-semibold">{orders}</span>
            <FiChevronRight className="text-gray-500" />
          </div>
        </div>
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
          <span className="text-gray-700 font-medium">Products</span>
          <FiChevronRight className="text-gray-500" />
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-4 gap-2">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="bg-white p-2 rounded-lg shadow">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-lg cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-4">
              No products available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shops;
