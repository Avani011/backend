import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token feild from response
    //check for user creation
    // return response or error

    const {fullName, email, username, password} = req.body
    // console.log("email: ", email);

    if ([fullName, email, username, password].some((field) => field?.trim() === "" )) {
        throw new ApiError(400, "All fields are required !")
    }

    // if(fullName === "") {
    //     throw new ApiError(400, "fullName is required!") 
    // } basic method to validate one field at a time

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username exists! " )
    }

    // console.log(req.files);

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage?.[0]?.path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar Image is required!")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar){
        throw new ApiError(400, "Avatar Image is required!");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrtong while registering user!")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully!!")
    )

} )

export {registerUser}