"use server";

import prisma from "@prisma/prisma";
import { name } from "file-loader";

export const createShop = async (form) => {
  const {
    id,
    name,
    description,
    longitude,
    latitude,
    kingdom,
    category,
    userId,
  } = form;
  console.log("Create shop action was triggered");

  try {
    const shop = await prisma.shop.create({
      data: {
        id: id,
        name: name,
        description: description,
        longitude: longitude,
        latitude: latitude,
        kingdom: kingdom,
        category: category,
        userId: userId,
      },
    });

    console.log("sharp! you now own a shop at ", shop.kingdom);
    return true;
  } catch (error) {
    console.log("Error creating shop", error);
    return false;
  }
};

export const fetchUserShopById = async (id) => {
  console.log("about to fetch shops of user with the id", id);

  try {
    const stores = await prisma.shop.findUnique({
      where: {
        name: id,
      },
      include: {
        shopItems: true,
        statuses: true,
        orders: {
          include: {
            items: true,
            user: {
              select: {
                username: true,
                longitude: true,
                latitude: true,
                kingdom: true,
              },
            },
          },
        },
      },
    });
    console.log("stores", stores.name);
    return stores;
  } catch (error) {
    console.log("Error fetching stores of user", id, error);
  }
};
export const fetchUserShopByUserId = async (id) => {
  console.log("about to fetch shops of user with the id", id);

  try {
    const stores = await prisma.shop.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    console.log("stores", stores.name);
    return stores;
  } catch (error) {
    console.log("Error fetching stores of user", id, error);
  }
};

export const addShopItemsToShopId = async (shopId, product) => {
  const { name, image, description, quantity, price, category } = product;
  console.log("about to add items to shop ->", shopId);

  const shop = await prisma.shop.findUnique({
    where: { name: shopId },
  });

  if (!shop) {
    // if (!shop || shop.userId !== userId) {
    console.log("are you sure you are the owner");
    throw new Error("Unauthorized: You are not the owner of this shop");
  }
  console.log("Sure you are the owner");
  try {
    const addeditems = await prisma.shopItem.create({
      data: {
        tag: category,
        image: image,
        name: name,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        shopId: shop.id,
      },
    });
    console.log("ShopItems added successfully to shop", shop.name);
    return { success: true, addeditems };
  } catch (error) {
    console.error("Error adding items : ", error);
    return { success: false, message: error.message };
  }
};

export const createOrder = async (orderData) => {
  try {
    const order = await prisma.order.create({
      data: {
        orderId: orderData.orderId,
        totalAmount: orderData.totalAmount,
        orderDate: orderData.orderDate,
        status: orderData.status,
        userId: orderData.userId,
        shopId: orderData.shopId,
        items: {
          create: orderData.items.create,
        },
      },
    });
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; // Rethrow the error to be caught in the front end
  }
};

export const fetchOnlyShops = async () => {
  console.log("fetch only shop was invocked");
  const shops = await prisma.shop.findMany({
    include: {
      user: true,
    },
  });
  console.log("Shops where found");
  return { success: true, shops };
};

export const fetchAllShops = async () => {
  console.log("fetching all shops");
  try {
    const shops = await prisma.shop.findMany();
    console.log("All shops were fetched");
    return shops;
  } catch (error) {
    console.log("Error fetching all shops", error);
  }
};

export const filterShops = async (term, category) => {
  console.log("Filtering of shops was triggered", term, category);

  try {
    const shops = await prisma.shop.findMany({
      where: {
        AND: [
          category
            ? { category: { equals: category, mode: "insensitive" } }
            : {}, // Filter by category if provided
          {
            OR: [
              { name: { contains: term, mode: "insensitive" } }, // Match shop name
              {
                shopItems: {
                  some: { name: { contains: term, mode: "insensitive" } },
                },
              }, // Match shop items
            ],
          },
        ],
      },
      include: {
        shopItems: {
          select: {
            name: true,
          },
        },
      },
    });

    console.log("Indeed shops are being filtered", shops);
    return shops;
  } catch (error) {
    console.log("Error performing filtering", error);
    return null;
  }
};

export const updateShopDetails = async (shopId, form) => {
  const { name, image, desc, category } = form;

  console.log("Update shop Function was triggered");

  try {
    // Update the user
    const shop = await prisma.Shop.update({
      where: {
        name: shopId,
      },
      data: {
        name: name,
        description: desc,
        category: category,
        image: image,
      },
    });

    console.log("shop details updated successfully:", shop);

    return true;
  } catch (error) {
    console.error("Error updating shop:", error);
    return false;
  }
};

export const updateShopTileId = async ({
  storeName,
  newTileId,
  longitude,
  latitude,
  storeId,
}) => {
  console.log(
    "changing the shop id @ db",
    storeName,
    newTileId,
    longitude,
    latitude,
    storeId
  );
  try {
    // Update the user
    const shop = await prisma.Shop.update({
      where: {
        name: storeName,
      },
      data: {
        id: newTileId,
        longitude: longitude,
        latitude: latitude,
      },
    });

    console.log("shop tile id was changed:", shop.id, newTileId);

    return true;
  } catch (error) {
    console.error("Error updating shop tile id:", error);
    return false;
  }
};

export const deleteStore = async (shopId) => {
  console.log("Deleting store with id:", shopId);
  try {
    const shop = await prisma.shop.delete({
      where: {
        name: shopId, // Use the unique id field here
      },
    });
    console.log("Store deleted successfully:", shop);
    return true;
  } catch (error) {
    console.error("Error deleting store:", error);
    return false;
  }
};

export const shopCouter = async (userId) => {
  const shopCount = await prisma.shop.count({
    where: {
      userId: userId, // Replace with the actual user ID
    },
  });
  console.log("shop count =", shopCount);
  return shopCount;
};

export const getFilteredStores = async (category, searchedItem) => {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        AND: [
          category ? { category } : {},
          searchedItem
            ? {
                items: {
                  some: {
                    name: {
                      contains: searchedItem,
                      mode: "insensitive",
                    },
                  },
                },
              }
            : {},
        ],
      },
      include: {
        items: true, // Include items to display them if needed
      },
    });

    console.log("shops filterd based on ", shops);
    return shops;
  } catch (error) {
    console.log("Error performing filtering", error);
  }
};
