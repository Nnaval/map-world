"use client";

import BackNav from "@components/BackNav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import {
  fetchProductById,
  updateProductDetails,
} from "@lib/actions/product.prisma";

const EditProductPage = ({ params }) => {
  const router = useRouter();
  const productId = decodeURIComponent(params.id);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(productId);
        if (!fetchedProduct) {
          throw new Error("Failed to fetch product details");
        }
        setProduct({
          name: fetchedProduct.name,
          description: fetchedProduct.description,
          quantity: fetchedProduct.quantity,
          price: fetchedProduct.price,
          category: fetchedProduct.tag,
          image: fetchedProduct.image,
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Only allow numbers and decimals for quantity and price fields
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event, formId) => {
    const file = event.target.files[0];
    if (file && file instanceof Blob) {
      // const formData = new FormData();
      // formData.append("file", file);
      // // formData.append("upload_preset", "your_preset");

      try {
        const base = await convertToBase64(file);
        console.log("base =", base);

        const response = await fetch("/api/cloudinary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base }),
        });
        const data = await response.json();
        setProduct((prev) => ({
          ...prev,
          image: data.url,
        }));
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("no form data");
    }
  };

  const handleSubmit = async () => {
    try {
      const success = await updateProductDetails(productId, product);
      if (!success) {
        console.log("product update failed");
        throw new Error("Failed to update product");
      }

      router.back();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full flex items-center mb-4">
        <BackNav />
      </div>

      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-3xl cursor-pointer mb-4 relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input" className="absolute cursor-pointer z-20">
          <FaCamera className="text-3xl text-gray-600" />
        </label>
        {product.image && (
          <Image
            src={product.image}
            alt="Product Image"
            layout="fill"
            className="w-full h-full object-cover rounded-3xl"
          />
        )}
      </div>

      <input
        type="text"
        name="name"
        value={product.name}
        onChange={handleChange}
        placeholder="Name of Product"
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        name="description"
        value={product.description}
        onChange={handleChange}
        rows="7"
        placeholder="Description"
        className="w-full p-2 border rounded mb-2"
      ></textarea>
      <input
        type="number"
        name="quantity"
        value={product.quantity}
        onChange={handleNumberChange}
        placeholder="Quantity in stock"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        name="price"
        value={product.price}
        onChange={handleNumberChange}
        placeholder="Price"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        name="category"
        value={product.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Confirm Changes
      </button>
    </div>
  );
};

export default EditProductPage;
