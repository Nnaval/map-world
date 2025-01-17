import cloudinary from "@lib/cloudinary";

export const POST = async (req, res) => {
  const { image } = await req.json();

  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: "your_folder_name", // Optional folder to organize uploads
    });
    console.log("File upload was successfull", uploadResponse.secure_url);
    return new Response(JSON.stringify({ url: uploadResponse.secure_url }), {
      status: 200,
    });
  } catch (error) {
    console.log("error Failed to upload image", error);
    return new Response("upload image failed", { status: 500 });
  }
};
