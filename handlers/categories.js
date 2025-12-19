import { StatusCodes } from "http-status-codes";
import categoryModel from "../models/category.js";

export async function getCategories(req, res) {
  try {
    const categories = await categoryModel.find();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message || error,
    });
  }
}
export async function createCategory(req, res) {
  try {
    const category = await categoryModel.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Category created successfully",
      data: category.toObject ? category.toObject() : category,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.code === 11000) {
        res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: "Category already exists",
          error: error.message || "Duplicate category",
        });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Failed to create category",
          error: error.message || error.toString(),
        });
      }
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create category due to server error",
        error: String(error),
      });
    }
  }
}
export async function getCategoryById(req, res) {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to fetch category ${req.params.id}`,
      error: error.message || error,
    });
  }
}
export async function updateCategory(req, res) {
  try {
    const category = await categoryModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to update category ${req.params.id}`,
      error: error.message || error,
    });
  }
}
export async function deleteCategory(req, res) {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      throw new Error("Category not found");
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to delete category ${req.params.id}`,
      error: error.message || error,
    });
  }
}
