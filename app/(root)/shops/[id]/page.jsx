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
    image: "/assets/logo.svg",
    relatedImages: [
      "/assets/logo.svg",
      "/assets/logo.svg",
      "/assets/logo.svg",
      "/assets/IceHomeImage1.jpg",
    ],
  },
];

const ShopsDynamicPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4">
        <AiOutlineArrowLeft
          className="text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
      </div>

      <div className="flex justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={250}
          height={250}
          className="rounded-lg"
        />
      </div>

      <div className="p-6">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.description}</p>

        <div className="mt-10">
          <p className="text-gray-700 font-semibold">Price</p>
          <div className="flex space-x-4 mt-2">
            <button className="border border-blue-500 text-blue-500 text-md px-4 font-bold py-2 rounded-lg">
              Add to Cart
            </button>
            <button className="bg-blue-500 text-white text-md px-4 py-2 font-bold rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {product.relatedImages.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt="related product"
              width={60}
              height={60}
              className="rounded-lg cursor-pointer"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopsDynamicPage;
