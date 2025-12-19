import Product from "../models/products.js";
import Category from "../models/category.js";
import User from "../models/user.js";
import Order from "../models/orders.js";
import { successResponse, errorResponse } from "../utils/responseFormatter.js";
import { StatusCodes } from "http-status-codes";

/**
 * Get admin dashboard statistics
 * GET /api/admin/stats
 */
export async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Get revenue from orders
    const orders = await Order.find().select("total");
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // Get recent products
    const recentProducts = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent users
    const recentUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(
      res,
      {
        stats: {
          totalUsers,
          totalProducts,
          totalCategories,
          totalOrders,
          totalRevenue,
        },
        recentProducts,
        recentUsers,
      },
      "Dashboard stats fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return errorResponse(
      res,
      error,
      "Failed to fetch dashboard stats",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
export async function getAllUsers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments();

    return successResponse(
      res,
      {
        users,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
      "Users fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return errorResponse(
      res,
      error,
      "Failed to fetch users",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Update user role (admin only)
 * PUT /api/admin/users/:id/role
 */
export async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["Admin", "User"].includes(role)) {
      return errorResponse(
        res,
        null,
        "Invalid role. Must be 'Admin' or 'User'",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
    }

    return successResponse(res, user, "User role updated successfully");
  } catch (error) {
    console.error("Error updating user role:", error);
    return errorResponse(
      res,
      error,
      "Failed to update user role",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:id
 */
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Prevent deleting the current user
    if (req.user._id.toString() === id) {
      return errorResponse(
        res,
        null,
        "You cannot delete your own account",
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return errorResponse(res, null, "User not found", StatusCodes.NOT_FOUND);
    }

    return successResponse(res, null, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    return errorResponse(
      res,
      error,
      "Failed to delete user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Get all categories
 * GET /api/admin/categories
 */
export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find().sort({ name: 1 });

    return successResponse(res, categories, "Categories fetched successfully");
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(
      res,
      error,
      "Failed to fetch categories",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Create category (admin only)
 * POST /api/admin/categories
 */
export async function createCategory(req, res) {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return errorResponse(
        res,
        null,
        "Category name is required",
        StatusCodes.BAD_REQUEST
      );
    }

    // Check if category already exists
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return errorResponse(
        res,
        null,
        "Category already exists",
        StatusCodes.BAD_REQUEST
      );
    }

    const category = new Category({ name: name.trim() });
    await category.save();

    return successResponse(
      res,
      category,
      "Category created successfully",
      StatusCodes.CREATED
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return errorResponse(
      res,
      error,
      "Failed to create category",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Update category (admin only)
 * PUT /api/admin/categories/:id
 */
export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return errorResponse(
        res,
        null,
        "Category name is required",
        StatusCodes.BAD_REQUEST
      );
    }

    // Check if another category with this name exists
    const existing = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id },
    });
    if (existing) {
      return errorResponse(
        res,
        null,
        "Another category with this name already exists",
        StatusCodes.BAD_REQUEST
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true }
    );

    if (!category) {
      return errorResponse(
        res,
        null,
        "Category not found",
        StatusCodes.NOT_FOUND
      );
    }

    return successResponse(res, category, "Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    return errorResponse(
      res,
      error,
      "Failed to update category",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Delete category (admin only)
 * DELETE /api/admin/categories/:id
 */
export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    // Check if any products use this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return errorResponse(
        res,
        null,
        `Cannot delete category: ${productsCount} product(s) use this category`,
        StatusCodes.BAD_REQUEST
      );
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return errorResponse(
        res,
        null,
        "Category not found",
        StatusCodes.NOT_FOUND
      );
    }

    return successResponse(res, null, "Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return errorResponse(
      res,
      error,
      "Failed to delete category",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * Get all products with full details (admin only)
 * GET /api/admin/products
 */
export async function getAdminProducts(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter)
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);

    return successResponse(
      res,
      {
        products,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
      "Products fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return errorResponse(
      res,
      error,
      "Failed to fetch products",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
