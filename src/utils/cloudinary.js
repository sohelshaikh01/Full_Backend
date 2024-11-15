import { v2 as cloudinary} from cloudinary;
import fs from "fs"; // file system by default in node.js

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_KEY,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Doing more optimisly

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        // Upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file has been upload successful
        console.log("file has uploaded cloudinary", response.url);
        return response;

    } catch (error) {
        // file comes on server but not uploaded
        // So need to remove to not full storage
        fs.unlinkSync(localFilePath);
        // remove the locally saved file as the upload operation go failed
        return null;
        
    }
}

export { uploadOnCloudinary };
