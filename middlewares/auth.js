import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

export async function CheckAuth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Token doesn't exist");
    }

    const verified = jwt.verify(token, process.env.AUTH_SECRET);
    if (!verified) {
      throw new Error("Unverified token used");
    }

    const user = await userModel.findById(verified._id).select("-password");
    if (!user) {
      throw new Error("User is disabled or deleted");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Error in validating token",
      error: err,
    });
  }
}

export async function isAdmin(req, res, next) {
  if (req.user.role === "Admin") {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: "You are not an admin, you can't access this route",
    });
  }
}
