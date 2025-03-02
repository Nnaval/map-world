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

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];

  return (
    <div className="min-h-screen bg-white">
      {/* Back Arrow */}
      <div className="p-4">
        <AiOutlineArrowLeft
          className="text-2xl cursor-pointer"
          onClick={() => router.back()}
        />
      </div>

      {/* Main Product Image */}
      <div className="flex justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600 text-sm">{product.description}</p>

        {/* Price and Buttons */}
        <div className="mt-4">
          <p className="text-gray-700 font-semibold">Price</p>
          <div className="flex space-x-4 mt-2">
            <button className="border border-blue-500 text-blue-500 px-4 py-2 rounded-lg">
              Add to Cart
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Product Images */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-2">
          {product.relatedImages.map((img, index) => (
            <Image key={index} src={img} alt="related product" width={80} height={80} className="rounded-lg cursor-pointer" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
