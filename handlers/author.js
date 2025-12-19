import { StatusCodes } from "http-status-codes";
import authorModel from "../models/author.js";
import bookModel from "../models/books.js";

// Get all authors with pagination and search
export async function getAuthors(req, res) {
  try {
    const { limit, page, sortBy, sortOrder, search } = req.parsedQuery;
    const filter = search ? { $text: { $search: search } } : {};

    const authors = await authorModel
      .find(filter)
      .populate("books", "title cover")
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ [sortBy]: sortOrder });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Authors fetched successfully",
      data: authors,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch authors",
      error: error.message || error,
    });
  }
}

// Get single author by ID with their books
export async function getAuthorById(req, res) {
  try {
    const author = await authorModel.findById(req.params.id).populate("books");

    if (!author) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Author fetched successfully",
      data: author,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to fetch author ${req.params.id}`,
      error: error.message || error,
    });
  }
}

// Create new author (Admin only)
export async function createAuthor(req, res) {
  try {
    const author = await authorModel.create(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Author created successfully",
      data: author,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Author already exists",
        error: error.message || error,
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Failed to create author",
        error: error.message || error,
      });
    }
  }
}

// Update author (Admin only)
export async function updateAuthor(req, res) {
  try {
    const author = await authorModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Author not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Author updated successfully",
      data: author,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to update author ${req.params.id}`,
      error: error.message || error,
    });
  }
}

// Delete author (Admin only) - check if author has books
export async function deleteAuthor(req, res) {
  try {
    const author = await authorModel.findById(req.params.id);

    if (!author) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Author not found",
      });
    }

    // Check if author has any books
    if (author.books && author.books.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message:
          "Cannot delete author with existing books. Please reassign or delete the books first.",
      });
    }

    await authorModel.findByIdAndDelete(req.params.id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Author deleted successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: `Failed to delete author ${req.params.id}`,
      error: error.message || error,
    });
  }
}
