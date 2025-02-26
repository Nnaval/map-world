"use server";

// import { auth, signIn,getSession } from "@auth";
// import prisma from "@prisma/prisma";

import { signIn } from "../../auth"; // Ensure the correct import
import prisma from "@prisma/prisma";

export const createUser = async (form) => {
  const { email, fullname, username, password } = form;

  console.log("Create user Function was triggered");

  try {
    // Create the user
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: password,
        name: fullname,
      },
    });

    console.log("User created successfully:", user);

    // Sign in the user after creation
    await signIn("credentials", {
      email: user.email,
      password: password,
      redirect: false,
    });

    return true;
  } catch (error) {
    console.error("Error creating user:", error);
    return false;
  }
};

export const updateUser = async (userId, form) => {
  const {
    name,
    img,
    kingdom,
    levelName,
    about,
    bio,
    departmentName,
    longitude,
    latitude,
  } = form;

  console.log("Update user Function was triggered");

  try {
    // Find or create the department
    const department = departmentName
      ? await prisma.department.upsert({
          where: { name: departmentName },
          create: { name: departmentName },
          update: {},
        })
      : null;

    // Find or create the level
    const level = levelName
      ? await prisma.level.upsert({
          where: { name: levelName },
          create: { name: levelName },
          update: {},
        })
      : null;

    // Update the user
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
        picture: img,
        about: about,
        bio: bio,
        levelId: level?.id,
        departmentId: department?.id,
        longitude: longitude,
        latitude: latitude,
        kingdom: kingdom,
      },
    });

    console.log("User updated successfully:", user);

    // Sign in the user after creation
    await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });

    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

export const login = async (credentials) => {
  const { email, password } = credentials;
  console.log("Login was triggered");

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("I did not see this email at the database");
    }
    const doesPasswordMatch = (await password) === user.password;
    if (!doesPasswordMatch)
      throw new Error("The password does not match with the provided email");
    console.log("Login Successfull");
    return user;
  } catch (error) {
    console.log("error Loggin in", error);
  }
};

export const fetchUserByUsername = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        shops: true,
        department: true,
        level: true,
      },
    });
    console.log("User -->", user.name, "found🫡");
    return user;
  } catch (error) {
    console.log("Error fetching the user :", username, "😓", error);
  }
};

export const fetchOnlyUserInfo = async (username) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        department: true,
        level: true,
      },
    });
    console.log("User -->", user, "found🫡");
    return user;
  } catch (error) {
    console.log("Error fetching the user :", username, "😓", error);
  }
};
