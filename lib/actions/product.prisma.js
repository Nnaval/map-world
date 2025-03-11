"use server";

import prisma from "@prisma/prisma";

export const fetchProductById = async (id) => {
  console.log("about to fetch shops of user with the id", id);
  const parseId = parseFloat(id);

  try {
    const product = await prisma.shopItem.findUnique({
      where: {
        id: parseId,
      },
    });
    console.log("stores", product.name);
    return product;
  } catch (error) {
    console.log("Error fetching product", id, error);
  }
};
