"use client";
import { fetchProductById } from "@lib/actions/product.prisma";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
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

const ProductDynamicPage = ({ params }) => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const productId = params.id.replace(/%20/g, " ");
  useEffect(() => {
    const fetchProduct = async () => {
      // setLoading(true)
      try {
        const fetchedProduct = await fetchProductById(productId);
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading Product with details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center mb-14">
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
          objectFit="contain" /* Ensures the image covers the entire space */
          className=""
        />
      </div>

      <div className="p-4 w-full">
        <h2 className="text-lg font-semibold capitalize">{product.name}</h2>

        <div className="flex flex-col gap-1 mt-3">
          <h2 className="text-lg font-bold capitalize">product Description</h2>
          <p className="text-gray-600 text-sm">{product?.description}</p>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <div
          className={`flex-1 min-w-[200px] flex flex-col gap-2 border-l-[3px] rounded bg-slate-100 px-5 py-4 border-primary border-1 `}
        >
          <div className="flex gap-3">
            <p className="text-base text-black-100">Price</p>
            <Image
              src={"/assets/price-tag.svg"}
              alt={"price tag"}
              width={16}
              height={16}
            />{" "}
          </div>
          <div className="flex gap-1">
            <p className="text-2xl font-bold text-secondary">
              ₦{product.price}
            </p>
          </div>
        </div>

        <div
          className={`flex-1 min-w-[200px] flex flex-col gap-2 border-l-[3px] rounded bg-slate-100 px-5 py-4 border-primary border-1 `}
        >
          <div className="flex gap-3">
            <p className="text-base text-black-100">Quantity</p>
            <Image
              src={"/assets/price-tag.svg"}
              alt={"price tag"}
              width={16}
              height={16}
            />{" "}
          </div>
          <div className="flex gap-1">
            <p className="text-2xl font-bold text-secondary">
              {product.quantity}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 w-full">
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
          {products.relatedImages?.map((img, index) => (
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
