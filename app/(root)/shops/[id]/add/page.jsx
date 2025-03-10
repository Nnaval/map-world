"use client";
import {
  addShopItemsToShopId,
  fetchUserShopById,
} from "@lib/actions/shops.prisma";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

const Page = ({ params }) => {
  const { data: session } = useSession();
  const userId = parseFloat(session?.user.id);

  const shopId = params.id.replace(/%20/g, " ");
  const [shop, setShop] = useState({});

  const [wasNewImageUploaded, setWasNewImageUploaded] = useState(false);

  useEffect(() => {
    const fetchUserShop = async () => {
      try {
        const fetchedShop = await fetchUserShopById(shopId);
        setShop(fetchedShop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };
    fetchUserShop();
  }, []);
  // console.log("shop", shop);

  const [title, setTitle] = useState("");

  const [forms, setForms] = useState([
    { id: 1, name: "", price: "", desc: "", quantity: "", image: "" }, // Initial form with fields
  ]);
  const handleAddForm = () => {
    setForms([
      ...forms,
      { id: forms.length + 1, name: "", price: "", quantity: "", image: "" },
    ]);
  };
  const handleInputChange = (id, field, value) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === id ? { ...form, [field]: value } : form
      )
    );
  };

  const router = useRouter();
  const handleSubmit = async () => {
    const dataToSubmit = {
      tag: title,
      items: forms,
      userId: userId,
      shopId: shopId,
    };
    // console.log("Submitting data:", dataToSubmit);
    try {
      const result = await addShopItemsToShopId(dataToSubmit);
      // console.log("items added successfully" , result)
      if (result.success) {
        router.back();
      }
    } catch (error) {
      console.error("Error submmiting data :", error);
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
        setForms((prevForms) =>
          prevForms.map((form) =>
            form.id === formId ? { ...form, image: data.url } : form
          )
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      console.log("no form data");
    }
  };

  return (
    <div>
      <h6 className="font-bold text-xl">Stock Your Store with Items</h6>
      <div className="">
        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Enter title for items"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent outline-none mb-5"
        />

        {/* Render all the forms from the state */}
        {forms.map((form) => (
          <div
            key={form.id}
            className="flex flex-col border border-primary-500 p-2 rounded-md w-full mb-4"
          >
            <div className="flex justify-between w-full">
              <div className="flex items-start gap-2">
                <div className="rounded-full w-24 h-24 border   flex justify-center items-center cursor-pointer">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, form.id)}
                    className="hidden"
                    id={`file-input-${form.id}`}
                  />

                  {/* Camera icon button to trigger file input */}
                  <label
                    htmlFor={`file-input-${form.id}`}
                    className="absolute cursor-pointer"
                  >
                    <FaCamera className="text-3xl text-gray-600" />
                  </label>

                  {/* Display the selected image */}
                  {form.image && (
                    <Image
                      src={form.image}
                      alt="Profile_image"
                      width={100}
                      height={100}
                      className="rounded w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <label htmlFor="name" className="font-bold text-sm">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Item Name"
                      value={form.name}
                      onChange={(e) =>
                        handleInputChange(form.id, "name", e.target.value)
                      }
                      className="bg-transparent outline-none border"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="name" className="font-bold text-sm">
                      Description
                    </label>
                    <input
                      type="text"
                      name="desc"
                      placeholder="Item desc"
                      value={form.desc}
                      onChange={(e) =>
                        handleInputChange(form.id, "desc", e.target.value)
                      }
                      className="bg-transparent outline-none border"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="price" className="font-bold text-sm">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={form.price}
                      onChange={(e) =>
                        handleInputChange(form.id, "price", e.target.value)
                      }
                      className="bg-transparent outline-none border"
                    />
                  </div>
                </div>
              </div>
              <MdEdit className="text-white text-xl" />
            </div>
            <div className="flex text-sm w-full gap-4 mt-2">
              {/* <div className="flex flex-col">
                <label htmlFor="qty" className="font-bold text-sm">
                  Qty
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={(e) =>
                    handleInputChange(form.id, "quantity", e.target.value)
                  }
                  className="bg-transparent outline-none border"
                />
              </div> */}
            </div>
          </div>
        ))}

        {/* Button to add a new form */}
        <div className="flex items-end justify-end w-full my-2">
          <button type="button" className="btn p-1" onClick={handleAddForm}>
            Add
          </button>
        </div>

        {/* Button to submit the form data */}
        <div className="flex items-end justify-end w-full my-2">
          <button type="button" className="btn p-1" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
