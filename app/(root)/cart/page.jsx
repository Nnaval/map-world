"use client";
import { useState } from "react";
import { AiFillDelete } from "react-icons/ai";

const CartPage = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Product Chair",
      description: "White Color",
      quantity: 3,
      image: "/assets/IceHomeImage1.jpg",
    },
    {
      id: 2,
      name: "Product Table",
      description: "Pepper Red",
      quantity: 2,
      image: "/assets/IceHomeImage1.jpg",
    },
    {
      id: 3,
      name: "Product Gun",
      description: "AR15",
      quantity: 1,
      image: "/assets/IceHomeImage1.jpg",
    },
  ]);

  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Product Machine",
      description: "Nnewi machine",
      price: 1000,
      quantity: 2,
      image: "/assets/IceHomeImage1.jpg",
    },
    {
      id: 2,
      name: "Shawarma",
      description: "chicken and beef",
      price: 500,
      quantity: 1,
      image: "/assets/IceHomeImage1.jpg",
    },
    {
      id: 3,
      name: "Bread",
      description: "LoveBite company",
      price: 800,
      quantity: 3,
      image: "/assets/IceHomeImage1.jpg",
    },
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const increaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 2280;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4">
      <div className="flex w-full justify-around mb-4 border-b">
        <button
          className={`p-2 ${
            activeTab === "requests"
              ? "border-b-2 w-[150px] border-blue-500"
              : ""
          }`}
          onClick={() => handleTabChange("requests")}
        >
          Requests
        </button>
        <button
          className={`p-2 ${
            activeTab === "cart" ? "border-b-2 w-[150px] border-blue-500" : ""
          }`}
          onClick={() => handleTabChange("cart")}
        >
          Cart
        </button>
      </div>

      {activeTab === "requests" && (
        <div className="w-full">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-6 border mb-2 rounded flex items-center"
            >
              <img
                src={request.image}
                alt={request.name}
                className="w-16 h-16 mr-4 rounded"
              />
              <div className="">
                <h3 className="mb-1 text-lg font-bold">{request.name}</h3>
                <p className="mb-1">{request.description}</p>
                <p className="mb-1 text-sm ">Qty: {request.quantity}</p>
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                  Accept
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "cart" && (
        <div className="w-full">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-4 border mb-2 rounded flex items-center justify-between"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 mr-4 rounded"
              />
              <div>
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p>{item.description}</p>
                <p className="font-bold">Price: #{item.price}</p>
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-xl order-1"
              >
                <AiFillDelete />
              </button>
            </div>
          ))}
          <div className="p-4 mt-4">
            <div className="flex justify-between">
              <p>Subtotal:</p>
              <p className="font-bold">#{subtotal}</p>
            </div>
            <div className="flex justify-between">
              <p>Shipping:</p>
              <p className="font-bold">#{shipping}</p>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p className="font-bold">#{total}</p>
            </div>
            <button className="bg-blue-500 text-white w-full py-2 rounded-xl mt-2">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
