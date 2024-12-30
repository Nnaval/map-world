"use server";

import prisma from "@prisma/prisma";

export const rejectOrder = async (orderId, comment) => {
  console.log("reject order function was fired");

  try {
    const updateOrder = await prisma.order.update({
      where: { orderId: orderId },
      data: {
        status: "rejected",
        comment: comment,
      },
    });
    console.log("updated order", updateOrder);
    return true;
  } catch (error) {
    console.log("Error rejecting order", error);
    return false;
  }
};
