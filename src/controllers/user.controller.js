import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Register User
const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation 
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary: url
    // Create user object(for mongodb) - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    // if data from form & json but not in url
    const { fullName, email, username, password } = req.body;
    console.log("email", email);

    // if(fullName === "") {
    //     throw new ApiError(404, "fullname is required");
    // } // one by one checking

    // Check for all things together
    if( [fullName, email, username, password].some((field) => 
        field?.trim() === "" ) ) {
            throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({ 
        $or: [{ username }, { email }]
    });

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // More options from multer
    const avatarLocalPath = req.files?.avatar[0]?.path; // Still on temp server
    const coverImageLocation = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required");
    }

    // uploading images files on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocation);

    if(!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",  
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = User.findById( user._id ).select( 

        // By default all selected and - for not this things
        "-password -refreshtoken "
    );

    // Error from server not create user
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json( 
        new ApiResponse(200, createUser, "User registered successfully");
        // status data message
    );


});

export { registerUser };