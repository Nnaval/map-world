"use client";
import BackNav from "@components/BackNav";
import { useState } from "react";

const EditProductPage = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    quantity: "",
    price: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // only numbers are allowed for quantity and price fields but decimal is allowed
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="w-full flex items-center mb-4">
        <BackNav />
      </div>

      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-3xl cursor-pointer mb-4">
        <span className="text-gray-500">📷</span>
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
        placeholder="#Price"
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

      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Confirm Changes
      </button>
    </div>
  );
};

export default EditProductPage;
