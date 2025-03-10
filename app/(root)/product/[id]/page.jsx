"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";

const products = [
  {
    id: "1",
    name: "Product Name",
    description: "Product Full Description",
    price: "$20.00",
    image: "/assets/IceHomeImage1.jpg",
    relatedImages: [
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
      "/assets/IceHomeImage1.jpg",
    ],
  },
];

const ProductDynamicPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <div className="w-full p-4 flex items-center">
        <AiOutlineArrowLeft
          className="text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
      </div>
      {/* recent changes */}
      <div className="w-full flex justify-center bg-gray-100 p-6 relative h-[40vh]">
        <Image
          src={product.image}
          alt={product.name}
          layout="fill" /* Makes the image take full width & height */
          objectFit="cover" /* Ensures the image covers the entire space */
          className=""
        />
      </div>

      <div className="p-4 w-full">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.description}</p>
      </div>

      <div className="p-4 w-full">
        <p className="text-gray-700 font-semibold">Price</p>
        <div className="flex justify-center w-full space-x-4 mt-2">
          <button className="border border-blue-700 text-blue-700 px-4 py-2 rounded-lg w-full">
            Add to Cart
          </button>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg w-full">
            Buy Now
          </button>
        </div>
      </div>

      <div className="p-4 w-full">
        <div className="grid grid-cols-4 gap-2">
          {product.relatedImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="related product"
              width={80}
              height={80}
              className="rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDynamicPage;
