"use server";

import prisma from "@prisma/prisma";
import { Select } from "@radix-ui/react-select";

export const fetchProductById = async (id) => {
  console.log("about to fetch product  with the id", id);
  const parseId = parseFloat(id);

  try {
    const product = await prisma.shopItem.findUnique({
      where: {
        id: parseId,
      },
      include: {
        shop: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log("product", product);
    return product;
  } catch (error) {
    console.log("Error fetching product", id, error);
  }
};

export const updateProductDetails = async (productId, form) => {
  const { name, price, quantity, image, description, category } = form;
  const parseId = parseFloat(productId);

  console.log("Update product Function was triggered");

  try {
    // Update the user
    const product = await prisma.shopItem.update({
      where: {
        id: parseId,
      },
      data: {
        name: name,
        description: description,
        quantity: quantity || 1,
        price: price,
        tag: category,
        image: image,
      },
    });

    console.log("shop details updated successfully:", product);

    return true;
  } catch (error) {
    console.error("Error updating shop:", error);
    return false;
  }
};
