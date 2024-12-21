import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshTokens = async function(userId) {
    // take userId
    // try and catch things
    // get user using userId
    try {
        const user  = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
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
    // Get user details from req
    // check validate and trim each
    // check user exists: username, email
    // throw error  if user exists
    // check for images, check for avatar
    // upload them to cloudinary: url
    // get uploaded url to store
    // create and save user details
    // get user without password and refreshToken
    // check for user creation
    // return response

const registerUser = asyncHandler( async (req, res) => {

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
        "-password -refreshToken"
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


// Login User
    // Get User details from req
    // check valid username and email
    // check user present or not
    // if not throw error
    // password check method
    // access, refresh token generate
    // send token to user cookies or http header

const loginUser = asyncHandler( async(req, res) => {

    const { email, username, password } = req.body;

    console.log(req.body);

    // check for both username or email
    if(!(username || email)) {
        throw new ApiError(400, "username or password is required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }] // finding for both username or email
    });

    if(!user) {
        throw new ApiError(404, "User does not exists");
    }

    // user is used to call methods created in user.model.js
    // User is used to call mongoDb methods

    
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
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
        new ApiResponse( 200, {
                user: loggedInUser, 
                accessToken, 
                refreshToken
            },
            "User Logged in Successfully"
        )
    );

});   


// Logout User
    // Get User Id
    // remove cookies & tokens
    // Creating middleware for it

const logoutUser = asyncHandler( async (req, res) => {


    const userId = req.user._id;

    // Using this so no more user, validate, refreshtoken delete and save
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            // give new version of info in response old contain refreshToken
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

});


// Get refresh token from cookies
// Comes from cookies or body
// store in variable
// if not throw error
// decrypt token
// hold and find user from it
// if not user
// if token not match user stored token

const refreshAccessToken = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    // user has encrypted version of token
    try {
        const decodedToken = jwt.verify(incomingRefreshToken. process.env.REFRESH_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id);
    
        if(!user) {
            throw new ApiError(401, "Invalid Refresh Token");
        }
    
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {  accessToken, newrefreshToken } = await generateAccessandRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken: newrefreshToken },
                "Access Token refresh"
            )
        );
        
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh Token");
    }

});


// Change Current User Password

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // some may check newPassword & confirmPassword, it can be done in frontend  

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    user.save({ validateBeforeSave: false });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
    
});


const getCurrentUser = asyncHandler( async (req, res) => {

    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully");
});


const updateAccountDetails = asyncHandler( async(req, res) => {
    const { fullName, email } = req.body;


    if(!fullName || !email) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password");


    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )


});


const updateUserAvatar = asyncHandler( async(req, res) => {
    const avatarLocalPath = req.file?.path; // req.file (not files here) for single file

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true}
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar image updated successfully")
    )

});


const updateUserCoverImage = asyncHandler( async(req, res) => {
    const coverImageLocalPath = req.file?.path; // req.file (not files here) for single file

    if(!coverImageLocalPath) {
        throw new ApiError(400, "Cover Image file is missing");
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage.url) {
        throw new ApiError(400, "Error while uploading on coverImage");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true}
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Cover image updated successfully")
    )

});


const getUserChannelProfile = asyncHandler( async(req, res) => {

    const { username } = req.params;


    if( !(username.trim()))  {
        throw new ApiError(400, "Username is missing");
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }, // getting user
        },
        { // using lookup to get its subscribers
            $lookup: {
                // model in lowercase and plural in database
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel", // what basis to get docs
                as: "subscribers"  // name of outcome new document
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: { // To Add Additional fields
                subscribersCount: {
                    $size: "$subscribers" // using $ because it is field now
                },
                channelisSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: { // check whether the user is subscribed or not
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: { // showing selected this to further access
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelisSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ]);
    // It returns array after using aggregate

    if(!channel?.length) {
        throw new ApiError(404, "channel does not exists");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )    


});



const getWatchHistory = asyncHandler( async(req, res) => {

    const user = await User.aggregate([
        {
            match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
                // here _id string not auto converted to mongoDB ObjectId
                // code goes directly
            }
        }, // we user here
        { // we have to get watch history now
            $lookup: {
                from: "videos", // which model to access
                localField: "watchHistory", // user model field to store
                foreignField: "_id", // video model field
                as: "watchHistory", // output array set
                pipeline: [
                    {   // now in videos doc
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner", 
                            // All below data is stored in owner array
                            // It has to modified for frontend easyness
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ] // This pipelines can also be written on another stages
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            } 
        }
    ]); // watchHistory -> videos -> User or Video owner -> owner details


    return res
    .status(200)
    .json(
        new ApiResponse(200, user[0].watchHistory, "Watch History Fetched Successfully")
    )

});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};