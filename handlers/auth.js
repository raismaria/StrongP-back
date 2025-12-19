import { StatusCodes } from "http-status-codes";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT token
    const userInfo = {
      _id: user._id,
      email: user.email,
      role: user.role || "User",
    };

    const token = jwt.sign(userInfo, process.env.AUTH_SECRET);

    // Remove password from response
    const userResponse = user.toObject
      ? user.toObject()
      : JSON.parse(JSON.stringify(user));
    delete userResponse.password;

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Login successful",
      data: userResponse,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);

    // Handle MongoDB and validation errors
    if (err instanceof Error && "code" in err) {
      if (err.code === 11000) {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: "Email already exists",
        });
      }
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message || "Validation failed",
      });
    }

    // Handle standard errors
    if (err instanceof Error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message,
      });
    }

    // Default error
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An unexpected error occurred during login",
    });
  }
}
export async function register(req, res) {
  const user = req.body;
  try {
    const createdUser = await userModel.create(user);

    const userInfo = {
      _id: createdUser._id,
      createdAt: new Date(),
    };
    const token = jwt.sign(userInfo, process.env.AUTH_SECRET);
    createdUser.password = undefined;

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "You have registered",
      data: createdUser,
      token,
    });
  } catch (err) {
    if (err instanceof Error && "code" in err) {
      if (err.code === 11000) {
        res.status(400).json({
          success: false,
          message: "user already exist",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid user validation",
          error: err,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Unknown error",
        error: err,
      });
    }
  }
}

export async function checkUser(req, res) {
  const user = req.user;
  if (!user) {
    throw new Error("User not Found");
  }

  res.json({
    success: true,
    message: "User is authenticated",
    data: user,
  });
}
