import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessandRefreshTokens = async function(userId) {
    // take userId
    // try and catch things
    // get user using userId
    try {
        const user  = User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false});
        // this kicks all fields in db model before save so,

        return { accessToken, refreshToken };
        // saving refresh token in database so no need email, password repeatively

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

// const apiEndpoint = asyncHandler( async (req, _ ) => {});
// If we don't use `res` in controller then use "_".

// AsyncHandler is used on web request like method not like above internal methods
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

    // if(fullName === "") {
    //     throw new ApiError(404, "fullname is required");
    // } // one by one checking

    // Check for all things together
    if( [fullName, email, username, password].some((field) => 
        field?.trim() === "" ) ) {
            throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ // added await 
        $or: [{ username : username.toLowerCase() }, { email }]
    });

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    
    // More options from multer
    const avatarLocalPath = req.files?.avatar[0]?.path || null; // Still on temp server
    // const coverImageLocalpath = req.files?.coverImage[0]?.path || null;
    
    let coverImageLocalPath;
    
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
    // This runs further code if coverImage is not there.
    
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar File is required");
    }
    
    // uploading images files on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // added later

    
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
    
    const createdUser = await User.findById( user._id ).select( 
        // added await  

        // By default all selected and - for not this things
        "-password -refreshtoken"
    ).lean(); // plain javascript return avoid mongodb metadata

    // Error from server not create user
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json( 
        new ApiResponse(201, createdUser, "User registered successfully")
        // status data message
    );


});


const loginUser = asyncHandler( async(req, res) => {
    // username, email, password
    // check user present or not
    // if not go to sign up
    // password check
    // access, refresh token generate
    // send token to user cookies or http header

    const { email, username, password } = req.body;

    // check for both username or email
    if(!(username || email)) {
        throw new ApiError(400, "username or password is required");
    }

    const user = await User.findOne( {
        $or: [{ email }, { email }] // finding for both username or email
    });

    if(!user) {
        throw new ApiError(404, "User does not exists");
    }

    // user is used to call methods created in user.model.js
    // User is used to call mongoDb methods

    
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user._id); 

    // Information to send user
    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

    // By default cookies can be modified from frontend
    // Then it is only modified by the server
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, {
                user: loggedInUser, accessToken, refreshToken
            },
            "user Logged in Successfully"
        )
    );

});

const logoutUser = asyncHandler( async (req, res) => {
    // remove cookies & tokens
    // Creating middleware for it

    const userId = req.user._id;

    // Using this so no more user, validate, refreshtoken delete and save
    await User.findByIdAndUpdate(
        res.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            // give new response old contain refreshToken
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( 
        new ApiResponse(200, {}, "User logged out successfully")
    )

})


export { 
    registerUser,
    loginUser,
    logoutUser
};